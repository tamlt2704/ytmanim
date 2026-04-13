# Chapter 4: A Retry Charges the Customer Again

[← Chapter 3: Deadlocks](ch03-deadlocks.md) | [Chapter 5: The Database Melts →](ch05-async-kafka.md)

---

## The Incident

ZeroTrust was right. A customer's payment timed out. Their app retried. The transfer executed twice. The customer was debited $500 twice — $1000 gone instead of $500.

> **@ZeroTrust:** Customer submitted transfer-xyz. Network timeout. Client retried with the same data. We processed it twice. That's $500 of someone else's money we just created.

At scale, this happens constantly. Network blips, load balancer retries, Kafka redeliveries, impatient users clicking "Send" three times. Every retry is a potential duplicate.

## The Failing Test

```java
@Test
void retryingSameTransferShouldNotDebitTwice() {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("0.00"));
    accountRepository.saveAll(List.of(alice, bob));

    TransferRequest request = new TransferRequest(
        "transfer-xyz", "alice", "bob", new BigDecimal("500.00"));

    // First submission
    transferService.submitTransfer(request);
    transferService.executeTransfer("transfer-xyz");

    // Retry — same idempotency key
    transferService.submitTransfer(request);
    transferService.executeTransfer("transfer-xyz");

    // FAILS without idempotency — Alice debited $1000 instead of $500
    assertThat(accountRepository.findById("alice").get().getBalance())
        .isEqualByComparingTo("500.00");
}
```

## What Happened

Without idempotency protection, the service treats every request as new. Same data, same accounts, same amount — but it runs the transfer again. The customer loses money.

## The Fix — Idempotency Key with Unique DB Index

Every transfer has a client-generated `idempotencyKey`. The database enforces uniqueness. If the same key comes in twice, we return the cached result instead of re-executing.

```java
// TransferEvent entity — unique index on idempotencyKey
@Entity
@Table(name = "transfer_events", indexes = {
    @Index(name = "idx_idempotency_key", columnList = "idempotencyKey", unique = true)
})
public class TransferEvent {
    @Column(nullable = false, unique = true)
    private String idempotencyKey;
    // ...
}
```

```java
// In TransferService.submitTransfer()
@Transactional
public TransferEvent submitTransfer(TransferRequest request) {
    // Check if we've seen this key before
    var existing = transferEventRepository
        .findByIdempotencyKey(request.idempotencyKey());
    if (existing.isPresent()) {
        return existing.get(); // return cached result, don't re-execute
    }

    // ... validate and persist as PENDING
    TransferEvent event = TransferEvent.from(request);
    try {
        return transferEventRepository.save(event);
    } catch (DataIntegrityViolationException e) {
        // Race condition: another thread inserted the same key
        return transferEventRepository
            .findByIdempotencyKey(request.idempotencyKey()).orElseThrow();
    }
}
```

And in `executeTransfer()`:

```java
// Already processed — idempotent no-op
if (event.getStatus() != TransferStatus.PENDING) {
    return event;
}
```

Three layers of protection:
1. `findByIdempotencyKey()` — fast check before doing anything
2. Unique DB index + `DataIntegrityViolationException` catch — handles the race where two threads pass the check simultaneously
3. Status check in `executeTransfer()` — even if somehow called twice, the second call is a no-op

## The Test Passes

```java
@Test
void retryingSameTransferShouldNotDebitTwice() {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("0.00"));
    accountRepository.saveAll(List.of(alice, bob));

    TransferRequest request = new TransferRequest(
        "transfer-xyz", "alice", "bob", new BigDecimal("500.00"));

    // First submission + execution
    transferService.submitTransfer(request);
    transferService.executeTransfer("transfer-xyz");

    // Retry — same idempotency key
    TransferEvent retry = transferService.submitTransfer(request);
    transferService.executeTransfer("transfer-xyz");

    // ✅ Alice debited exactly once
    assertThat(accountRepository.findById("alice").get().getBalance())
        .isEqualByComparingTo("500.00");
    assertThat(accountRepository.findById("bob").get().getBalance())
        .isEqualByComparingTo("500.00");
}
```

ZeroTrust tests it by submitting the same transfer 100 times. Alice is debited exactly once. "Acceptable," he says. High praise from ZeroTrust.

TicketMaster looks at the traffic projections for launch day. "We're expecting 50,000 transfers per second. Can the database handle that?"

You look at your synchronous `POST /sync` endpoint. One request = one database transaction = one thread blocked until commit. At 50,000 TPS, that's 50,000 concurrent database connections.

Bobby Tables laughs. "PostgreSQL maxes out at a few hundred connections. You need a buffer."

---

[← Chapter 3: Deadlocks](ch03-deadlocks.md) | [Chapter 5: The Database Melts →](ch05-async-kafka.md)
