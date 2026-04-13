# Chapter 3: Two Transfers Deadlock the Database

[← Chapter 2: Double-Spending](ch02-double-spending.md) | [Chapter 4: A Retry Charges Twice →](ch04-idempotency.md)

---

## The Incident

Monday. Bobby Tables was right.

> **@BobbyTables:** Two transactions are stuck. PostgreSQL killed one after 30 seconds. The other went through. Customer is confused.

You check the database logs. Two transfers happened at the same time:
- Transfer 1: Alice → Bob ($100)
- Transfer 2: Bob → Alice ($50)

Transfer 1 locked Alice's row, then tried to lock Bob's. Transfer 2 locked Bob's row, then tried to lock Alice's. Both waiting for each other. Classic deadlock.

```
Transfer 1: LOCK alice ✓ → LOCK bob ... waiting
Transfer 2: LOCK bob   ✓ → LOCK alice ... waiting
                              ↑ both stuck forever
```

PostgreSQL detected the deadlock after 30 seconds and killed one transaction. The other completed. But 30 seconds of hanging is unacceptable, and the killed transaction returned an error to the customer.

## The Failing Test

```java
@Test
void bidirectionalTransfersShouldNotDeadlock() throws InterruptedException {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("1000.00"));
    accountRepository.saveAll(List.of(alice, bob));

    Thread t1 = new Thread(() ->
        transferService.executeTransfer("alice", "bob", new BigDecimal("100.00")));
    Thread t2 = new Thread(() ->
        transferService.executeTransfer("bob", "alice", new BigDecimal("50.00")));

    t1.start();
    t2.start();
    t1.join(5000);
    t2.join(5000);

    // FAILS — one thread is still alive (deadlocked) or threw an exception
    assertThat(t1.isAlive()).isFalse();
    assertThat(t2.isAlive()).isFalse();
}
```

## What Happened

The problem is lock ordering. Transfer 1 locks Alice first, then Bob. Transfer 2 locks Bob first, then Alice. Circular wait = deadlock.

```
Thread 1: findByIdForUpdate("alice") → locked ✓
Thread 2: findByIdForUpdate("bob")   → locked ✓
Thread 1: findByIdForUpdate("bob")   → BLOCKED (Thread 2 holds it)
Thread 2: findByIdForUpdate("alice") → BLOCKED (Thread 1 holds it)
→ DEADLOCK
```

## The Fix — Ordered Lock Acquisition

Always lock the account with the smaller ID first. Both threads acquire locks in the same order, so circular wait is impossible.

```java
@Transactional
public TransferEvent executeTransfer(String idempotencyKey) {
    TransferEvent event = transferEventRepository
        .findByIdempotencyKey(idempotencyKey).orElseThrow();

    if (event.getStatus() != TransferStatus.PENDING) {
        return event; // already processed
    }

    // Lock accounts in consistent order — prevents deadlocks
    String firstId = event.getFromAccountId().compareTo(event.getToAccountId()) < 0
            ? event.getFromAccountId() : event.getToAccountId();
    String secondId = event.getFromAccountId().compareTo(event.getToAccountId()) < 0
            ? event.getToAccountId() : event.getFromAccountId();

    var firstAccount = accountRepository.findByIdForUpdate(firstId);
    var secondAccount = accountRepository.findByIdForUpdate(secondId);

    // Map back to from/to
    var fromAccount = event.getFromAccountId().equals(firstId)
            ? firstAccount : secondAccount;
    var toAccount = event.getToAccountId().equals(firstId)
            ? firstAccount : secondAccount;

    // ... debit, credit, save
}
```

Now both transfers lock in the order (alice, bob) — because "alice" < "bob" alphabetically. No circular wait. No deadlock.

```
Thread 1 (alice→bob): LOCK alice ✓ → LOCK bob ✓ → transfer → commit
Thread 2 (bob→alice): LOCK alice ... waiting → LOCK bob ✓ → transfer → commit
```

Thread 2 waits for Thread 1 to finish with Alice, then proceeds. Sequential, safe, no deadlock.

## The Test Passes

```java
@Test
void bidirectionalTransfersShouldNotDeadlock() throws InterruptedException {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("1000.00"));
    accountRepository.saveAll(List.of(alice, bob));

    Thread t1 = new Thread(() ->
        transferService.executeTransfer("alice", "bob", new BigDecimal("100.00")));
    Thread t2 = new Thread(() ->
        transferService.executeTransfer("bob", "alice", new BigDecimal("50.00")));

    t1.start();
    t2.start();
    t1.join(5000);
    t2.join(5000);

    // ✅ Both complete, no deadlock
    assertThat(t1.isAlive()).isFalse();
    assertThat(t2.isAlive()).isFalse();

    // Alice: 1000 - 100 + 50 = 950
    // Bob: 1000 + 100 - 50 = 1050
    assertThat(accountRepository.findById("alice").get().getBalance())
        .isEqualByComparingTo("950.00");
    assertThat(accountRepository.findById("bob").get().getBalance())
        .isEqualByComparingTo("1050.00");
}
```

Bobby Tables nods. "Same pattern I use for schema migrations. Always acquire locks in the same order."

ZeroTrust overhears. "What happens when a customer's payment fails and they hit the retry button 47 times?"

You feel a chill.

---

[← Chapter 2: Double-Spending](ch02-double-spending.md) | [Chapter 4: A Retry Charges Twice →](ch04-idempotency.md)
