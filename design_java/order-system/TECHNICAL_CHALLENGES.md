# Technical Challenges: Order Management Microservices

## Goal

Build a multi-service e-commerce order system demonstrating microservices patterns: saga orchestration, event-driven communication, database-per-service, caching, and compensating transactions.

---

## Challenge 1: Distributed Transactions Across Services

### The Problem

In a monolith, placing an order is one database transaction: deduct inventory, create order, charge payment — all or nothing. In microservices, each service has its own database. There's no shared transaction. If payment fails after inventory is reserved, the inventory is stuck in a "reserved but never used" state. Traditional 2-phase commit (2PC) doesn't work across services — it's slow, fragile, and creates tight coupling.

### The Solution — Saga Pattern (Choreography)

Each service publishes events and reacts to events from other services. The order lifecycle is a chain of local transactions coordinated by events:

```
ORDER_CREATED → INVENTORY_RESERVED → PAYMENT_COMPLETED → ORDER_CONFIRMED
                                   ↘ PAYMENT_FAILED → ORDER_CANCELLED → inventory released
              ↘ INVENTORY_FAILED → ORDER_FAILED
```

Each step is a local transaction within one service's database. If a step fails, compensating events trigger rollback in previous services.

### Why It Works

- No distributed locks or 2PC coordinator — each service is autonomous
- Kafka guarantees event delivery (at-least-once with manual ack)
- Compensating transactions (release inventory, refund payment) undo previous steps
- Each service can fail and recover independently

---

## Challenge 2: Data Consistency Without Shared Database

### The Problem

With database-per-service, you can't JOIN across services or enforce foreign keys between them. The Product Service doesn't know about orders. The Order Service doesn't know about inventory levels. Data can become inconsistent if events are lost or processed out of order.

### The Solution — Event-Driven Eventual Consistency

Each service owns its data and publishes state changes as events:

```java
// Product Service publishes after reserving inventory
kafkaTemplate.send(Topics.INVENTORY_EVENTS, orderId, inventoryReservedEvent);

// Order Service reacts to the event
@KafkaListener(topics = Topics.INVENTORY_EVENTS)
public void onInventoryEvent(OrderEvent event, Acknowledgment ack) {
    orderService.onInventoryReserved(event.orderId());
    ack.acknowledge();
}
```

### Why It Works

- Each service is the single source of truth for its domain (products, orders, payments)
- Events propagate state changes asynchronously — services don't need to be online simultaneously
- Manual acknowledgment ensures events aren't lost — failed processing = redelivery
- Idempotency keys prevent duplicate processing on redelivery

---

## Challenge 3: Stale Product Data Under High Read Traffic

### The Problem

The Product Service gets hammered with read requests (catalog browsing, price checks). Every request hitting PostgreSQL creates connection pressure and latency. At scale, the database becomes the bottleneck.

### The Solution — Cache-Aside Pattern with Redis

```java
public Optional<Product> getProduct(String id) {
    // 1. Check cache
    Object cached = redisTemplate.opsForValue().get("product:" + id);
    if (cached instanceof Product p) return Optional.of(p);

    // 2. Cache miss → load from DB
    Optional<Product> product = repository.findById(id);

    // 3. Populate cache
    product.ifPresent(p -> redisTemplate.opsForValue().set("product:" + id, p, Duration.ofMinutes(10)));
    return product;
}

// 4. Invalidate on write
private void evictCache(String productId) {
    redisTemplate.delete("product:" + productId);
}
```

### Why It Works

- Reads hit Redis (sub-millisecond) instead of PostgreSQL
- Cache is invalidated on inventory changes (reserve/release) so stale stock levels don't persist
- TTL of 10 minutes provides a safety net even if invalidation is missed
- `GenericJackson2JsonRedisSerializer` stores products as JSON — human-readable, debuggable

---

## Challenge 4: Overselling Under Concurrent Orders

### The Problem

Two users order the last item simultaneously. Both read stock = 1, both reserve 1 unit, stock goes to -1. Classic lost-update race condition — same problem as the bank transfer service but in a different domain.

### The Solution — Pessimistic Locking on Inventory

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT p FROM Product p WHERE p.id = :id")
Optional<Product> findByIdForUpdate(String id);
```

Combined with `@Version` for optimistic locking as a safety net:

```java
@Version
private Long version;
```

### Why It Works

- `SELECT ... FOR UPDATE` locks the row — only one transaction can modify stock at a time
- The second concurrent request blocks until the first commits
- `@Version` catches any edge case where pessimistic locking is bypassed
- Cache is evicted after stock changes so subsequent reads see the correct value

---

## Challenge 5: Duplicate Orders from Client Retries

### The Problem

Client submits an order, gets a timeout (network issue), retries. Now there are two orders for the same purchase. The user gets charged twice, inventory is double-reserved.

### The Solution — Idempotency at Every Service Boundary

```java
// Order Service
@Column(nullable = false, unique = true)
private String idempotencyKey;

Optional<Order> existing = repository.findByIdempotencyKey(idempotencyKey);
if (existing.isPresent()) return existing.get();

// Payment Service
@Column(nullable = false, unique = true)
private String orderId; // one payment per order

Optional<Payment> existing = repository.findByOrderId(orderId);
if (existing.isPresent()) return existing.get();
```

### Why It Works

- Client generates the idempotency key — retries send the same key
- DB unique index is the ultimate guard against concurrent duplicates
- `DataIntegrityViolationException` catch handles the race condition where two threads pass the `findBy` check simultaneously
- Kafka redelivery is also safe — the consumer processes the same event idempotently

---

## Challenge 6: Saga Compensation (Rollback Without Transactions)

### The Problem

Payment fails after inventory is already reserved. There's no `ROLLBACK` across services. The reserved inventory is stuck — the product shows "out of stock" but no order was placed.

### The Solution — Compensating Events

```java
// Order Service detects payment failure
public void onSagaFailed(String orderId, String reason) {
    order.fail(reason);

    // Publish cancellation → triggers compensation in other services
    OrderEvent cancelEvent = new OrderEvent(..., ORDER_CANCELLED, ...);
    kafkaTemplate.send(Topics.ORDER_EVENTS, orderId, cancelEvent);
}

// Product Service compensates
case ORDER_CANCELLED -> productService.releaseInventory(event.productId(), event.quantity());

// Payment Service compensates
case ORDER_CANCELLED -> paymentService.refund(event.orderId());
```

### Why It Works

- Each service knows how to undo its own work (release stock, refund payment)
- The ORDER_CANCELLED event triggers all compensations in parallel
- Idempotency ensures compensations are safe to retry
- The order record keeps a full audit trail (status + failureReason)

---

## Architecture Summary

```
                         Kafka Topics
                    ┌─────────────────────┐
                    │  order-events        │ ← ORDER_CREATED, ORDER_CANCELLED
                    │  inventory-events    │ ← INVENTORY_RESERVED, INVENTORY_FAILED
                    │  payment-events      │ ← PAYMENT_COMPLETED, PAYMENT_FAILED
                    └─────────────────────┘
                         ▲    │    ▲    │
            ┌────────────┘    │    │    └────────────┐
            │                 ▼    │                 │
   ┌────────┴───────┐  ┌─────┴────┴────┐  ┌────────┴───────┐
   │ Product Service │  │ Order Service │  │Payment Service │
   │                 │  │               │  │                │
   │ GET /products   │  │ POST /orders  │  │ (event-driven) │
   │ Redis cache     │  │ GET /orders   │  │                │
   │ Inventory mgmt  │  │ Saga orch.    │  │ Process/refund │
   │                 │  │               │  │                │
   │ [productdb]     │  │ [orderdb]     │  │ [paymentdb]    │
   └─────────────────┘  └───────────────┘  └────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Database per service | Data isolation, independent schema evolution, no cross-service JOINs |
| Kafka for messaging | Durable, ordered, replayable events with at-least-once delivery |
| Saga choreography | No central coordinator, services react to events autonomously |
| Redis cache-aside | Sub-millisecond product reads, invalidated on inventory changes |
| Pessimistic locking | Prevents overselling under concurrent orders |
| Idempotency everywhere | Safe retries at HTTP, Kafka, and database levels |
| Compensating transactions | Saga rollback without distributed transactions |
| Gradle multi-module | Shared common module for events, independent service builds |
