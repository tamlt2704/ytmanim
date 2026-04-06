# Technical Challenges: Bank Transfer Service

## Goal

Build an event-driven bank transfer service using Spring Boot, Java 21, and Kafka that handles millions of requests with guaranteed data integrity — no double-debits, no overdrafts, no lost transfers.

---

## Challenge 1: Double-Spending Under Concurrent Requests

### The Problem

When millions of transfer requests hit the service, multiple threads can read the same account balance simultaneously. Thread A reads $1000, Thread B reads $1000, both debit $800 — the account ends up at $200 instead of failing the second transfer. This is the classic lost-update problem.

### The Solution

Pessimistic locking with ordered lock acquisition:

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT a FROM Account a WHERE a.id = :id")
Optional<Account> findByIdForUpdate(String id);
```

Combined with consistent lock ordering to prevent deadlocks:

```java
String firstId = fromId.compareTo(toId) < 0 ? fromId : toId;
String secondId = fromId.compareTo(toId) < 0 ? toId : fromId;
var firstAccount = accountRepository.findByIdForUpdate(firstId);
var secondAccount = accountRepository.findByIdForUpdate(secondId);
```

### Why It Works

- `PESSIMISTIC_WRITE` acquires a database-level `SELECT ... FOR UPDATE` lock — only one transaction can modify an account at a time
- Ordering locks alphabetically by account ID prevents deadlocks (A→B and B→A both lock A first, then B)
- The `@Version` field on Account provides an additional optimistic locking safety net
- Tests verify: under 20 concurrent threads trying to drain $100 from an account, at most 1 succeeds and the balance never goes negative

---

## Challenge 2: Duplicate Transfers from Network Retries

### The Problem

At scale, clients retry failed requests, Kafka redelivers messages, and network partitions cause duplicate submissions. Without protection, the same transfer executes twice — debiting the sender's account double.

### The Solution

Idempotency via a unique `idempotencyKey` per transfer, enforced at the database level:

```java
@Column(nullable = false, unique = true)
private String idempotencyKey;

// In TransferService:
var existing = transferEventRepository.findByIdempotencyKey(request.idempotencyKey());
if (existing.isPresent()) {
    return existing.get(); // return cached result, don't re-execute
}
```

Plus a unique index and `DataIntegrityViolationException` catch for race conditions:

```java
try {
    return transferEventRepository.save(event);
} catch (DataIntegrityViolationException e) {
    // Another thread inserted the same key — return that one
    return transferEventRepository.findByIdempotencyKey(request.idempotencyKey()).orElseThrow();
}
```

### Why It Works

- The client generates the idempotency key — retries send the same key
- The unique DB index is the ultimate guard, even if two threads pass the `findBy` check simultaneously
- `executeTransfer()` also checks `if (event.getStatus() != PENDING)` — re-execution is a no-op
- Tests verify: submitting the same key twice returns the same event ID, and the account is debited only once

---

## Challenge 3: Decoupling Ingestion from Processing at Scale

### The Problem

Synchronous request processing creates a tight coupling between HTTP throughput and database transaction speed. At millions of requests, the database becomes the bottleneck — transactions queue up, connection pools exhaust, and latency spikes cascade into timeouts.

### The Solution

Kafka as an async buffer between ingestion and execution:

```
Client → POST /api/transfers/async → Kafka Topic → Consumer → TransferService.executeTransfer()
```

```java
// Producer: keyed by fromAccountId for partition ordering
kafkaTemplate.send(topic, request.fromAccountId(), request);

// Consumer: manual ack for at-least-once delivery
@KafkaListener(topics = "${transfer.topic}")
public void consume(TransferRequest request, Acknowledgment ack) {
    var event = transferService.submitTransfer(request);
    if (event.getStatus() == TransferStatus.PENDING) {
        transferService.executeTransfer(request.idempotencyKey());
    }
    ack.acknowledge();
}
```

### Why It Works

- Kafka absorbs traffic spikes — producers return immediately with 202 Accepted
- Partitioning by `fromAccountId` ensures all transfers from the same account are processed sequentially within a partition, reducing lock contention
- 10 partitions + 10 consumer threads = parallel processing across different accounts
- Manual acknowledgment (`ack-mode: manual`) means failed transfers are redelivered — combined with idempotency, this gives exactly-once semantics
- The sync endpoint (`POST /sync`) is still available for cases where the caller needs an immediate result

---

## Challenge 4: Data Validation at the Boundary

### The Problem

Invalid data entering the system is expensive — it consumes Kafka capacity, database connections, and processing time before failing. At millions of requests, even a small percentage of invalid requests creates significant waste.

### The Solution

Multi-layer validation:

```java
// Layer 1: Bean validation at the controller
public record TransferRequest(
    @NotBlank String idempotencyKey,
    @NotBlank String fromAccountId,
    @NotBlank String toAccountId,
    @NotNull @DecimalMin("0.01") BigDecimal amount
) {}

// Layer 2: Business validation in the service
if (request.fromAccountId().equals(request.toAccountId())) {
    return persistFailedEvent(request, FAILED_SAME_ACCOUNT, "Cannot transfer to same account");
}

// Layer 3: Domain validation in the entity
public void debit(BigDecimal amount) {
    if (this.balance.compareTo(amount) < 0) {
        throw new InsufficientFundsException(...);
    }
}
```

### Why It Works

- Layer 1 rejects malformed requests before they touch the service layer (400 Bad Request)
- Layer 2 catches business rule violations and persists them as failed events (audit trail)
- Layer 3 is the last line of defense inside the transaction — even if validation logic has a bug, the domain model protects itself
- `BigDecimal` instead of `double` prevents floating-point rounding errors in financial calculations
- Tests cover: zero amount, negative amount, same-account transfer, missing fields, nonexistent accounts, insufficient funds

---

## Challenge 5: Deadlocks in Bidirectional Transfers

### The Problem

Account A transfers to B, while simultaneously B transfers to A. Thread 1 locks A then waits for B. Thread 2 locks B then waits for A. Classic deadlock — both transactions hang until the database timeout kills one.

### The Solution

Consistent lock ordering — always lock the account with the smaller ID first:

```java
String firstId = event.getFromAccountId().compareTo(event.getToAccountId()) < 0
        ? event.getFromAccountId() : event.getToAccountId();
String secondId = ...opposite...;

accountRepository.findByIdForUpdate(firstId);   // always lock lower ID first
accountRepository.findByIdForUpdate(secondId);   // then higher ID
```

### Why It Works

- A→B and B→A both acquire locks in the order (A, B) — no circular wait, no deadlock
- This is a well-known pattern (lock ordering / resource hierarchy) applied to database rows
- Combined with Kafka's partition-by-sender key, most transfers from the same account are already serialized, making deadlocks rare even without this protection
- Tests verify bidirectional transfers complete correctly with proper balance accounting

---

## Challenge 6: Embedded Kafka Instability in Tests

### The Problem

We initially used `@EmbeddedKafka` from `spring-kafka-test` for self-contained tests. On Windows, the embedded Kafka broker:
- Failed to clean up temp directories (`FileSystemException: The process cannot access the file`)
- Created Zookeeper/KRaft conflicts with port binding
- Caused 14 out of 23 tests to fail with various infrastructure errors unrelated to business logic

### The Solution

Replaced embedded Kafka with a real Kafka instance running in Docker:

```bash
docker run --rm --name kafka-test -p 9092:9092 apache/kafka:3.7.0
```

Removed `spring-kafka-test` dependency and all `@EmbeddedKafka` annotations. Tests connect to `localhost:9092` directly.

### Why It Works

- Real Kafka handles concurrent consumers, partition rebalancing, and cleanup correctly
- No Windows-specific file locking issues with temp directories
- Tests reflect production behavior — same broker, same protocol, same serialization
- The `apache/kafka` Docker image uses KRaft mode (no Zookeeper) — single container, fast startup
- All 23 tests pass reliably

---

## Architecture Summary

```
                    ┌─────────────────────────────────────────┐
                    │           Transfer Controller           │
                    │                                         │
                    │  POST /sync ──→ immediate execution     │
                    │  POST /async ──→ Kafka producer         │
                    │  GET /{key} ──→ status lookup           │
                    └──────────┬──────────┬───────────────────┘
                               │          │
                    ┌──────────▼──┐  ┌────▼──────────────────┐
                    │   Kafka     │  │   TransferService     │
                    │   Topic     │  │                       │
                    │ (10 parts)  │  │  submitTransfer()     │
                    └──────┬──────┘  │   - idempotency check │
                           │         │   - validation        │
                    ┌──────▼──────┐  │   - persist PENDING   │
                    │   Kafka     │  │                       │
                    │  Consumer   ├──►  executeTransfer()    │
                    │ (10 threads)│  │   - ordered locking   │
                    └─────────────┘  │   - debit/credit      │
                                     │   - status → COMPLETED│
                                     └───────────┬───────────┘
                                                  │
                                     ┌────────────▼───────────┐
                                     │     H2 / PostgreSQL    │
                                     │                        │
                                     │  accounts (+ @Version) │
                                     │  transfer_events       │
                                     │   (unique idempotency) │
                                     └────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Pessimistic locking with ordered acquisition | Prevents double-spending and deadlocks under high concurrency |
| Idempotency key with unique DB index | Handles retries, Kafka redelivery, and duplicate submissions |
| Kafka partitioned by sender account | Serializes transfers per account, reduces lock contention |
| Manual consumer acknowledgment | At-least-once delivery + idempotency = effectively exactly-once |
| Multi-layer validation | Rejects bad data early, preserves audit trail for business failures |
| BigDecimal for money | No floating-point rounding errors in financial calculations |
| Virtual threads (Java 21) | Handles millions of concurrent requests without thread pool exhaustion |
| Real Kafka over embedded | Stable, production-realistic tests without platform-specific quirks |
