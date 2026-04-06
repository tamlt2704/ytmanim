# Technical Challenges: Notification Service

## Goal

Build a rate-limited, multi-channel notification service that handles high throughput with retry, circuit breaking, and delivery tracking — exercising core design patterns used in production systems.

---

## Challenge 1: Supporting Multiple Delivery Channels Without Coupling

### The Problem

Email, SMS, and Push notifications each have different providers, protocols, and payload formats. Hardcoding `if (channel == EMAIL) ... else if (channel == SMS)` creates a maintenance nightmare and violates the Open/Closed Principle — adding a new channel requires modifying existing code.

### The Solution — Strategy Pattern

```java
public interface NotificationChannel {
    Channel getType();
    void send(Notification notification) throws ChannelException;
}

@Component
public class EmailChannel implements NotificationChannel { ... }
@Component
public class SmsChannel implements NotificationChannel { ... }
@Component
public class PushChannel implements NotificationChannel { ... }
```

Spring auto-discovers all `NotificationChannel` beans and the service maps them by type:

```java
this.channels = channelList.stream()
    .collect(Collectors.toMap(NotificationChannel::getType, Function.identity()));
```

### Why It Works

- Adding a new channel (e.g., Slack, WhatsApp) = one new class, zero changes to existing code
- Each channel is independently testable and deployable
- The service selects the strategy at runtime based on the request's `channel` field

---

## Challenge 2: Transient Failures in External Providers

### The Problem

External providers (SES, Twilio, FCM) have transient failures — network blips, rate limits, temporary outages. A single failed attempt shouldn't permanently lose a notification.

### The Solution — Retry with Exponential Backoff (Decorator Pattern)

```java
public int executeWithRetry(SendAction action) throws ChannelException {
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            action.execute();
            return attempt;
        } catch (ChannelException e) {
            if (attempt < maxAttempts) {
                long delay = initialDelayMs * (1L << (attempt - 1)); // 500ms, 1s, 2s...
                Thread.sleep(delay);
            }
        }
    }
    throw lastException;
}
```

### Why It Works

- Exponential backoff prevents thundering herd on a recovering provider
- The `RetryExecutor` decorates any channel send — no retry logic inside channel implementations
- Max attempts are configurable per environment
- Tests verify: first-attempt success, retry-then-succeed, fail-after-max, and actual backoff timing

---

## Challenge 3: Cascading Failures When a Provider Is Down

### The Problem

If the SMS provider is down, every SMS notification triggers 3 retry attempts with backoff delays. At high throughput, this consumes all threads waiting on a dead provider, blocking healthy channels (email, push) too.

### The Solution — Circuit Breaker Pattern

```
CLOSED ──(failures >= threshold)──→ OPEN ──(timeout expires)──→ HALF_OPEN
  ↑                                                                  │
  └──────────(probe succeeds)──────────────────────────────────────────┘
                                                                     │
                                    OPEN ←──(probe fails)────────────┘
```

```java
CircuitBreaker breaker = circuitBreakerRegistry.get(request.channel().name());
if (!breaker.isCallPermitted()) {
    notification.markCircuitOpen();
    return notification; // fast-fail, don't even try
}
```

### Why It Works

- Per-channel breakers — SMS being down doesn't affect email or push
- Fast-fail saves thread time and provider load during outages
- HALF_OPEN state allows automatic recovery detection with a single probe request
- `ConcurrentHashMap` + `AtomicReference` for thread-safe state transitions
- Registry pattern ensures one breaker per channel name

---

## Challenge 4: Notification Spam and Abuse

### The Problem

A buggy client or malicious actor could flood a user with thousands of notifications per minute. Without rate limiting, users get spammed, providers throttle your account, and costs spike.

### The Solution — Redis Sliding Window Rate Limiter

```java
String key = "rate:" + userId;
long now = Instant.now().toEpochMilli();
long windowStart = now - (windowSeconds * 1000L);

redis.opsForZSet().removeRangeByScore(key, 0, windowStart); // prune expired
Long count = redis.opsForZSet().zCard(key);                  // count active
if (count >= maxPerWindow) return false;                      // deny

redis.opsForZSet().add(key, requestId, now);                  // record
```

Critical notifications (priority = CRITICAL) bypass the rate limiter entirely.

### Why It Works

- Sliding window is more accurate than fixed windows (no burst at window boundaries)
- Redis sorted sets give O(log N) operations — fast enough for millions of users
- Per-user isolation — one user's limit doesn't affect others
- CRITICAL priority bypass ensures system alerts always get through
- TTL on the Redis key prevents memory leaks for inactive users

---

## Challenge 5: Duplicate Notifications from Retries and Redelivery

### The Problem

Same as the bank transfer service — network retries, Kafka redelivery, and client bugs can submit the same notification multiple times. Users receiving duplicate OTP codes or payment confirmations is unacceptable.

### The Solution — Idempotency Key with Unique DB Index

```java
@Column(nullable = false, unique = true)
private String idempotencyKey;

var existing = repository.findByIdempotencyKey(request.idempotencyKey());
if (existing.isPresent()) return existing.get();
```

Plus `DataIntegrityViolationException` catch for race conditions between concurrent threads.

### Why It Works

- Client generates the key — retries naturally deduplicate
- DB unique index is the ultimate guard even under concurrent access
- Returns the original notification entity so the client gets a consistent response

---

## Challenge 6: Decoupling Ingestion from Processing

### The Problem

Synchronous notification processing ties HTTP throughput to provider latency. If the SMS provider takes 2 seconds per message, you can only process 500 SMS/second per thread — nowhere near millions.

### The Solution — Kafka Async Pipeline

```
POST /async → KafkaProducer → [notifications topic] → KafkaConsumer → NotificationService.process()
```

- Producer keys by `userId` for partition ordering (same user's notifications processed in order)
- Manual acknowledgment — failed processing = redelivery
- Idempotency ensures redelivery doesn't cause duplicates
- Sync endpoint still available for low-latency use cases

---

## Architecture Summary

```
Client Request
    │
    ├── POST /sync ──────────────────────────────────────┐
    │                                                     │
    └── POST /async → Kafka Producer → [Topic] → Consumer ┤
                                                          │
                                                          ▼
                                                 NotificationService
                                                          │
                                          ┌───────────────┼───────────────┐
                                          ▼               ▼               ▼
                                    Idempotency    TemplateRenderer   Rate Limiter
                                     (DB unique)   ({{params}})      (Redis ZSET)
                                          │               │               │
                                          └───────┬───────┘               │
                                                  ▼                       │
                                           Circuit Breaker ←──────────────┘
                                                  │
                                                  ▼
                                           RetryExecutor
                                                  │
                                    ┌─────────────┼─────────────┐
                                    ▼             ▼             ▼
                              EmailChannel   SmsChannel   PushChannel
                              (Strategy)     (Strategy)   (Strategy)
                                    │             │             │
                                    └──────┬──────┘─────────────┘
                                           ▼
                                    WebhookDispatcher
                                      (Observer)
```

### Design Patterns Summary

| Pattern | Implementation | Benefit |
|---------|---------------|---------|
| Strategy | `NotificationChannel` + impls | Add channels without modifying service |
| Decorator | `RetryExecutor` wraps send | Transparent retry with backoff |
| Observer | `WebhookDispatcher` | Decouple status tracking from delivery |
| Circuit Breaker | `CircuitBreaker` per channel | Isolate failures, auto-recover |
| Factory/Registry | `CircuitBreaker.Registry` | One breaker per channel, lazy init |
| Template Method | `TemplateRenderer` | Consistent rendering across channels |
| Idempotency | DB unique index + check | Safe retries and redelivery |
