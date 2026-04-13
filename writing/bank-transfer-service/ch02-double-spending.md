# Chapter 2: A Customer Loses $800 Twice

[← Chapter 1: Project Setup](ch01-project-setup.md) | [Chapter 3: Two Transfers Deadlock →](ch03-deadlocks.md)

---

## The Incident

Friday afternoon. The load test ran overnight. TicketMaster pings you:

> **@TicketMaster:** Customer Alice had $1000. She sent $800 to Bob. Her balance is now $200. But Bob received $1600. Where did the extra $800 come from?

You check the logs. Two transfer requests hit the service at the same time — both for $800 from Alice to Bob. Both read Alice's balance as $1000. Both deducted $800. Both credited Bob.

Alice was debited twice. $1000 - $800 - $800 = -$600. Except your `debit()` method checks for insufficient funds... so how did this happen?

Because both threads read $1000 *before* either one wrote. The classic lost-update problem.

## The Failing Test

```java
@Test
void concurrentTransfersShouldNotDoubleSpend() throws InterruptedException {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("0.00"));
    accountRepository.saveAll(List.of(alice, bob));

    int threads = 10;
    BigDecimal transferAmount = new BigDecimal("100.00");
    CountDownLatch latch = new CountDownLatch(threads);

    for (int i = 0; i < threads; i++) {
        final int idx = i;
        new Thread(() -> {
            try {
                transferService.executeTransfer("alice", "bob", transferAmount);
            } catch (Exception e) {
                // some should fail with insufficient funds
            } finally {
                latch.countDown();
            }
        }).start();
    }

    latch.await();

    BigDecimal aliceBalance = accountRepository.findById("alice").get().getBalance();
    BigDecimal bobBalance = accountRepository.findById("bob").get().getBalance();

    // Total money should be conserved: $1000 + $0 = $1000
    assertThat(aliceBalance.add(bobBalance))
        .isEqualByComparingTo("1000.00"); // FAILS — total is > $1000
}
```

The total is more than $1000. Money was created from thin air. In banking, this is called a "double-spend" and it's the kind of bug that makes regulators show up at your office.

## What Happened

```
Thread A: SELECT balance FROM accounts WHERE id='alice' → $1000
Thread B: SELECT balance FROM accounts WHERE id='alice' → $1000  ← same stale value!
Thread A: UPDATE balance = 1000 - 800 = $200 → saves
Thread B: UPDATE balance = 1000 - 800 = $200 → overwrites Thread A's write!
```

Both threads read $1000 before either wrote. Both computed $200. Both saved $200. Alice was debited $800 once instead of twice. Bob was credited $800 twice. $800 appeared from nowhere.

This is the **lost-update problem** — the database equivalent of the check-then-act race condition from the job engine.

## The Fix — Pessimistic Locking with `SELECT FOR UPDATE`

```java
// src/main/java/com/bank/repository/AccountRepository.java
@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(String id);
}
```

`PESSIMISTIC_WRITE` translates to `SELECT ... FOR UPDATE` in SQL. It tells the database: "Lock this row. No other transaction can read or write it until I'm done."

Now in the service:

```java
@Transactional
public void executeTransfer(String fromId, String toId, BigDecimal amount) {
    // Lock both accounts — no other thread can touch them
    Account from = accountRepository.findByIdForUpdate(fromId)
        .orElseThrow(() -> new RuntimeException("Account not found"));
    Account to = accountRepository.findByIdForUpdate(toId)
        .orElseThrow(() -> new RuntimeException("Account not found"));

    from.debit(amount);
    to.credit(amount);

    accountRepository.save(from);
    accountRepository.save(to);
}
```

Thread A locks Alice's row. Thread B tries to read Alice's row — blocked. Waits. Thread A finishes, commits, releases the lock. Thread B now reads the updated balance ($200), sees insufficient funds for another $800, and fails correctly.

## The Test Passes

```java
@Test
void concurrentTransfersShouldPreserveTotalBalance() throws InterruptedException {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("0.00"));
    accountRepository.saveAll(List.of(alice, bob));

    int threads = 10;
    BigDecimal transferAmount = new BigDecimal("100.00");
    CountDownLatch latch = new CountDownLatch(threads);

    for (int i = 0; i < threads; i++) {
        new Thread(() -> {
            try {
                transferService.executeTransfer("alice", "bob", transferAmount);
            } catch (Exception e) {
                // expected for some threads
            } finally {
                latch.countDown();
            }
        }).start();
    }

    latch.await();

    BigDecimal aliceBalance = accountRepository.findById("alice").get().getBalance();
    BigDecimal bobBalance = accountRepository.findById("bob").get().getBalance();

    // ✅ Total money is ALWAYS conserved
    assertThat(aliceBalance.add(bobBalance))
        .isEqualByComparingTo("1000.00");

    // ✅ Alice's balance is never negative
    assertThat(aliceBalance).isGreaterThanOrEqualTo(BigDecimal.ZERO);
}
```

10 threads, each trying to transfer $100. Total money: always $1000. Alice's balance: never negative. No double-spending.

Bobby Tables reviews the PR. "Pessimistic locking. Good. But what happens when Alice sends to Bob and Bob sends to Alice at the same time?"

You stare at him. "What do you mean?"

"Deadlocks," he says, and walks away.

---

[← Chapter 1: Project Setup](ch01-project-setup.md) | [Chapter 3: Two Transfers Deadlock →](ch03-deadlocks.md)
