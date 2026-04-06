# Notification Service

Rate-limited, multi-channel notification service built with Spring Boot 3.3, Java 21, Kafka, Redis, and PostgreSQL. Demonstrates Strategy, Decorator, Observer, and Circuit Breaker design patterns.

## Prerequisites

- Java 21
- Docker (for PostgreSQL, Redis, Kafka)

## Start Infrastructure

```bash
# PostgreSQL
docker run --rm --name postgres-test -p 5432:5432 \
  -e POSTGRES_DB=notifydb -e POSTGRES_USER=notify -e POSTGRES_PASSWORD=notify123 \
  postgres:16-alpine

# Redis
docker run --rm --name redis-test -p 6379:6379 redis:7-alpine

# Kafka (KRaft mode)
docker run --rm --name kafka-test -p 9092:9092 apache/kafka:3.7.0
```

## Build & Run

```bash
./gradlew build
./gradlew bootRun
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/sync` | Send immediately, returns result |
| POST | `/api/notifications/async` | Queue to Kafka, returns 202 |
| GET | `/api/notifications/{idempotencyKey}` | Check delivery status |

Request body:
```json
{
  "idempotencyKey": "unique-key",
  "userId": "user123",
  "channel": "EMAIL",
  "priority": "NORMAL",
  "templateName": "welcome",
  "templateParams": { "name": "Alice" },
  "webhookUrl": "https://example.com/webhook"
}
```

Channels: `EMAIL`, `SMS`, `PUSH`
Priorities: `LOW`, `NORMAL`, `HIGH`, `CRITICAL` (CRITICAL bypasses rate limiter)
Templates: `welcome`, `otp`, `alert`, `payment`, `reminder`

## Design Patterns

| Pattern | Where | Purpose |
|---------|-------|---------|
| Strategy | `NotificationChannel` interface + Email/SMS/Push impls | Swappable delivery channels |
| Decorator | `RetryExecutor` wraps channel send | Exponential backoff retry |
| Observer | `WebhookDispatcher` | Status change callbacks |
| Circuit Breaker | `CircuitBreaker` per channel | Stop hammering failing providers |
| Builder | `Notification.from()` factory | Clean entity construction |
| Template Method | `TemplateRenderer` | Channel-agnostic content rendering |

## Tests

Requires PostgreSQL, Redis, and Kafka running (see above).

```bash
./gradlew test
```

### Test Coverage (28 tests)

**Unit Tests (16 tests):**

- `TemplateRendererTest` (5): render with params, OTP template, null params, unknown template, exists check
- `CircuitBreakerTest` (7): initial state, open after threshold, reset on success, half-open after timeout, close from half-open, reopen from half-open, registry same-instance
- `RetryExecutorTest` (4): first-attempt success, retry-then-succeed, throw after max attempts, exponential backoff timing

**Integration Tests — NotificationServiceTest (6 tests):**

- Happy path: email/SMS/push delivery, sent timestamp recorded
- Idempotency: duplicate key returns same entity
- Validation: unknown template rejected
- Rate limiting: blocked after 10 requests, CRITICAL bypasses limit, different users independent

**Controller Tests — NotificationControllerTest (6 tests):**

- Sync send returns 200 with SENT status and rendered content
- Async send returns 202 ACCEPTED
- Status lookup by idempotency key
- 404 for unknown notification
- 400 for invalid request body
- 400 for unknown template

See [TECHNICAL_CHALLENGES.md](TECHNICAL_CHALLENGES.md) for detailed write-up.
