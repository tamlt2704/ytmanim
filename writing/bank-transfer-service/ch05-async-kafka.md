# Chapter 5: The Database Melts on Launch Day

[← Chapter 4: Idempotency](ch04-idempotency.md) | [Chapter 6: Someone Sends -$500 →](ch06-validation.md)

---

## The Incident

Launch day. Traffic ramps up. FiveNines is watching the dashboard.

> **@FiveNines:** DB connections at 100%. Latency spiking. 500 errors climbing. We're at 12,000 TPS and the database is drowning.

Every HTTP request opens a database transaction, acquires locks, does the transfer, commits. At 12,000 requests per second, the connection pool is exhausted. Requests queue up waiting for a connection. Latency goes from 50ms to 5 seconds. Timeouts cascade. The service is effectively down.

## What Happened

The synchronous endpoint creates a tight coupling between HTTP throughput and database transaction speed:

```
Client → HTTP → Thread → DB Connection → Lock → Transfer → Commit → Response
         ↑                                                            ↑
         └──── thread blocked the entire time ────────────────────────┘
```

At 50,000 TPS, you need 50,000 threads each holding a DB connection. PostgreSQL's default `max_connections` is 100. You're 500x over capacity.

## The Fix — Kafka as an Async Buffer

Decouple ingestion from processing. The HTTP endpoint dumps the request into Kafka and returns immediately. A pool of consumers processes transfers at the database's pace.

```
Client → POST /async → Kafka Topic → Consumer → TransferService → DB
         returns 202      ↑                          ↑
         immediately      buffer absorbs spikes      processes at DB speed
```

The producer:

```java
// src/main/java/com/bank/kafka/TransferProducer.java
@Component
public class TransferProducer {

    private final KafkaTemplate<String, TransferRequest> kafkaTemplate;
    private final String topic;

    public TransferProducer(KafkaTemplate<String, TransferRequest> kafkaTemplate,
                            @Value("${transfer.topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public CompletableFuture<Void> send(TransferRequest request) {
        // Key by fromAccountId — all transfers from same account
        // go to same partition → processed sequentially
        return kafkaTemplate.send(topic, request.fromAccountId(), request)
                .thenAccept(result -> log.debug("Sent to partition {}",
                        result.getRecordMetadata().partition()))
                .exceptionally(ex -> {
                    log.error("Failed to send: {}", ex.getMessage());
                    return null;
                });
    }
}
```

The consumer:

```java
// src/main/java/com/bank/kafka/TransferConsumer.java
@Component
public class TransferConsumer {

    private final TransferService transferService;

    @KafkaListener(topics = "${transfer.topic}", groupId = "bank-transfer-group")
    public void consume(TransferRequest request, Acknowledgment ack) {
        try {
            var event = transferService.submitTransfer(request);
            if (event.getStatus() == TransferStatus.PENDING) {
                transferService.executeTransfer(request.idempotencyKey());
            }
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed: {}", e.getMessage());
            // Don't ack — Kafka will redeliver
            // Idempotency key prevents double-execution on retry
        }
    }
}
```

The async controller:

```java
@PostMapping("/async")
public ResponseEntity<Map<String, String>> submitAsync(
        @Valid @RequestBody TransferRequest request) {
    transferProducer.send(request);
    return ResponseEntity.accepted().body(Map.of(
            "idempotencyKey", request.idempotencyKey(),
            "status", "ACCEPTED"
    ));
}
```

## Why This Works

**Kafka absorbs spikes.** 50,000 TPS hits the API? Kafka buffers them. 10 consumer threads process at the database's pace. The API returns 202 instantly.

**Partitioning by sender account.** All transfers from Alice go to the same partition → same consumer thread → processed sequentially. This reduces lock contention because concurrent transfers from different accounts hit different partitions.

**Manual ack + idempotency = exactly-once.** If a consumer crashes mid-transfer, Kafka redelivers the message. The idempotency key (Chapter 4) prevents double-execution. At-least-once delivery + idempotency = effectively exactly-once semantics.

**The sync endpoint stays.** `POST /sync` is still available for cases where the caller needs an immediate result. Two paths, same service, same guarantees.

FiveNines watches the dashboard after the fix. Traffic spikes to 80,000 TPS. Kafka absorbs it. Consumers process at a steady 5,000 TPS. No connection pool exhaustion. No latency spikes. "99.999%," he whispers.

But then ZeroTrust runs a security scan on the API...

---

[← Chapter 4: Idempotency](ch04-idempotency.md) | [Chapter 6: Someone Sends -$500 →](ch06-validation.md)
