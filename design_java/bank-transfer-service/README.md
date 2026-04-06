# Bank Transfer Service

Event-driven bank transfer service built with Spring Boot 3.3, Java 21, Kafka, and PostgreSQL. Designed to handle millions of requests with guaranteed data integrity.

## Prerequisites

- Java 21
- Docker (for PostgreSQL and Kafka)

## Start Infrastructure

```bash
# PostgreSQL
docker run --rm --name postgres-test -p 5432:5432 \
  -e POSTGRES_DB=bankdb -e POSTGRES_USER=bank -e POSTGRES_PASSWORD=bank123 \
  postgres:16-alpine

# Kafka (KRaft mode, no Zookeeper)
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
| POST | `/api/transfers/sync` | Execute transfer immediately, returns result |
| POST | `/api/transfers/async` | Submit to Kafka, returns 202 Accepted |
| GET | `/api/transfers/{idempotencyKey}` | Check transfer status |

Request body:
```json
{
  "idempotencyKey": "unique-key-123",
  "fromAccountId": "ACC1",
  "toAccountId": "ACC2",
  "amount": 100.00
}
```

## Tests

Requires PostgreSQL and Kafka running (see above).

```bash
./gradlew test
```

### Test Coverage (23 tests)

**TransferServiceTest** — 14 tests covering core business logic:

- Happy path: successful transfer, full balance transfer, small amounts (0.01)
- Validation: same-account rejection, insufficient funds, source/destination account not found
- Idempotency: duplicate key returns same event, duplicate execution doesn't double-debit
- Concurrency: 10 concurrent transfers preserve total balance, 20 threads racing to overdraft — at most 1 succeeds, balance never goes negative
- Edge cases: 10 sequential transfers, bidirectional A↔B transfers, processed timestamp recorded

**TransferControllerTest** — 9 tests covering the REST API:

- Sync transfer returns 200 with COMPLETED status
- Async transfer returns 202 with ACCEPTED status
- Status lookup by idempotency key
- 404 for unknown transfer
- 400 for missing fields, negative amount, zero amount
- Insufficient funds returns proper failure status
- Same-account transfer returns proper failure status

## Design Patterns

- Idempotency key with unique DB index — safe retries
- Pessimistic locking with ordered acquisition — no double-spending, no deadlocks
- Kafka partitioned by sender account — sequential processing per account
- Manual consumer ack + idempotency — effectively exactly-once semantics
- Multi-layer validation (bean → service → domain)
- Virtual threads (Java 21) — high concurrency without thread pool exhaustion

See [TECHNICAL_CHALLENGES.md](TECHNICAL_CHALLENGES.md) for detailed write-up of each challenge and solution.
