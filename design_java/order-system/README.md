# Order Management System — Microservices

Three Spring Boot microservices communicating via Kafka, each with its own PostgreSQL database, demonstrating saga orchestration, event-driven architecture, caching, and idempotency.

## Architecture

```
┌──────────────┐     Kafka      ┌──────────────┐     Kafka      ┌──────────────┐
│   Product    │ ◄────────────► │    Order     │ ◄────────────► │   Payment    │
│   Service    │                │   Service    │                │   Service    │
│   :8081      │                │   :8082      │                │   :8083      │
│              │                │  (Saga       │                │              │
│  Redis cache │                │  Orchestrator)│               │              │
│  productdb   │                │  orderdb     │                │  paymentdb   │
└──────────────┘                └──────────────┘                └──────────────┘
```

## Saga Flow

```
1. Client → POST /api/orders → Order Service creates order (CREATED)
2. Order Service → publishes ORDER_CREATED → Kafka
3. Product Service → reserves inventory → publishes INVENTORY_RESERVED
4. Order Service → receives INVENTORY_RESERVED → publishes to payment topic
5. Payment Service → processes payment → publishes PAYMENT_COMPLETED
6. Order Service → receives PAYMENT_COMPLETED → marks order CONFIRMED

Compensation (on failure at any step):
- INVENTORY_FAILED → Order marked FAILED
- PAYMENT_FAILED → Order marked FAILED, ORDER_CANCELLED published
- ORDER_CANCELLED → Product Service releases inventory, Payment Service refunds
```

## Prerequisites

- Java 21
- Docker (PostgreSQL, Redis, Kafka)

## Start Infrastructure

```bash
# PostgreSQL (shared instance, separate databases)
docker run --rm --name postgres-test -p 5432:5432 \
  -e POSTGRES_DB=bankdb -e POSTGRES_USER=bank -e POSTGRES_PASSWORD=bank123 \
  postgres:16-alpine

# Create databases and users
docker exec postgres-test psql -U bank -d bankdb -c "CREATE DATABASE productdb;"
docker exec postgres-test psql -U bank -d bankdb -c "CREATE DATABASE orderdb;"
docker exec postgres-test psql -U bank -d bankdb -c "CREATE DATABASE paymentdb;"
docker exec postgres-test psql -U bank -d bankdb -c "CREATE USER product WITH PASSWORD 'product123';"
docker exec postgres-test psql -U bank -d bankdb -c "CREATE USER orderuser WITH PASSWORD 'order123';"
docker exec postgres-test psql -U bank -d bankdb -c "CREATE USER payment WITH PASSWORD 'payment123';"
docker exec postgres-test psql -U bank -d productdb -c "GRANT ALL ON SCHEMA public TO product;"
docker exec postgres-test psql -U bank -d orderdb -c "GRANT ALL ON SCHEMA public TO orderuser;"
docker exec postgres-test psql -U bank -d paymentdb -c "GRANT ALL ON SCHEMA public TO payment;"

# Redis
docker run --rm --name redis-test -p 6379:6379 redis:7-alpine

# Kafka
docker run --rm --name kafka-test -p 9092:9092 apache/kafka:3.7.0
```

## Build & Test

```bash
./gradlew test
```

## Tests (20 tests)

**ProductServiceTest (7):** create/retrieve, reserve inventory, reject insufficient stock, release inventory, nonexistent product, nonexistent reservation, cache hit

**OrderServiceTest (7):** create order, idempotency, inventory reserved transition, payment confirmed transition, saga failure, get order, nonexistent order

**PaymentServiceTest (6):** successful payment, payment over limit, idempotency, refund, refund nonexistent, get by order ID

## Key Patterns

| Pattern | Where | Purpose |
|---------|-------|---------|
| Saga (Choreography) | Order ↔ Product ↔ Payment via Kafka | Distributed transaction across services |
| Event-Driven | Kafka topics per domain | Loose coupling between services |
| Database per Service | productdb, orderdb, paymentdb | Data isolation, independent scaling |
| Idempotency | Unique keys on orders and payments | Safe retries and redelivery |
| Cache-Aside | Redis in Product Service | Fast product lookups, cache invalidation on writes |
| Pessimistic Locking | Product inventory reservation | Prevent overselling under concurrency |
| Compensating Transaction | Inventory release + payment refund on failure | Saga rollback |

See [TECHNICAL_CHALLENGES.md](TECHNICAL_CHALLENGES.md) for detailed write-up.
