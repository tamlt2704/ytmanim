# Chapter 6: Someone Sends -$500 and Gets Rich

[← Chapter 5: Kafka](ch05-async-kafka.md) | [Chapter 7: You Ship It →](ch07-full-service.md)

---

## The Incident

ZeroTrust ran a security scan. He tried every edge case he could think of. Then he found it.

> **@ZeroTrust:** I just sent a transfer with amount: -500. The sender's balance went UP. I'm printing money.

He sent a transfer from Alice to Bob with amount `-$500`. The `debit()` method subtracted -$500 from Alice (which adds $500). The `credit()` method added -$500 to Bob (which subtracts $500). Alice gained money. Bob lost money. The transfer reversed itself.

Then he tried amount `0`. Then he tried transferring from Alice to Alice. Then he tried a nonexistent account.

> **@ZeroTrust:** I found 4 more ways to break this. I'm filing them all.

## The Failing Tests

```java
@Test
void shouldRejectNegativeAmount() {
    TransferRequest request = new TransferRequest(
        "key-1", "alice", "bob", new BigDecimal("-500.00"));

    // Without validation, this SUCCEEDS and reverses the transfer
    TransferEvent event = transferService.submitTransfer(request);
    assertThat(event.getStatus()).isNotEqualTo(TransferStatus.PENDING);
}

@Test
void shouldRejectZeroAmount() {
    TransferRequest request = new TransferRequest(
        "key-2", "alice", "bob", BigDecimal.ZERO);

    TransferEvent event = transferService.submitTransfer(request);
    assertThat(event.getStatus()).isNotEqualTo(TransferStatus.PENDING);
}

@Test
void shouldRejectSameAccountTransfer() {
    TransferRequest request = new TransferRequest(
        "key-3", "alice", "alice", new BigDecimal("100.00"));

    TransferEvent event = transferService.submitTransfer(request);
    assertThat(event.getStatus()).isEqualTo(TransferStatus.FAILED_SAME_ACCOUNT);
}
```

## What Happened

No validation. The service trusted the input completely. In a financial system, that's like leaving the vault door open.

## The Fix — Multi-Layer Validation

Three layers. Each one catches what the previous one missed.

**Layer 1: Bean validation at the controller.** Rejects malformed requests before they touch the service.

```java
public record TransferRequest(
    @NotBlank String idempotencyKey,
    @NotBlank String fromAccountId,
    @NotBlank String toAccountId,
    @NotNull @DecimalMin(value = "0.01") BigDecimal amount
) {}
```

`@DecimalMin("0.01")` kills negative and zero amounts at the door. The request never reaches the service.

**Layer 2: Business validation in the service.** Catches logic violations and records them as failed events (audit trail).

```java
@Transactional
public TransferEvent submitTransfer(TransferRequest request) {
    // ... idempotency check ...

    if (request.fromAccountId().equals(request.toAccountId())) {
        return persistFailedEvent(request, TransferStatus.FAILED_SAME_ACCOUNT,
                "Cannot transfer to the same account");
    }

    if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
        return persistFailedEvent(request, TransferStatus.FAILED_INVALID_AMOUNT,
                "Amount must be positive");
    }

    // ... persist as PENDING ...
}
```

Failed events are persisted — not silently dropped. Compliance needs an audit trail of every attempt, even the bad ones.

**Layer 3: Domain validation in the entity.** The last line of defense inside the transaction.

```java
public void debit(BigDecimal amount) {
    if (this.balance.compareTo(amount) < 0) {
        throw new InsufficientFundsException(
            "Account " + id + " has insufficient funds");
    }
    this.balance = this.balance.subtract(amount);
}
```

Even if a bug in the validation logic lets a bad amount through, the domain model protects itself. Defense in depth.

## The Tests Pass

```java
@Test
void shouldRejectNegativeAmount() {
    // ✅ Bean validation rejects at controller level (400 Bad Request)
    // If it somehow reaches the service, business validation catches it
}

@Test
void shouldRejectSameAccountTransfer() {
    TransferRequest request = new TransferRequest(
        "key-3", "alice", "alice", new BigDecimal("100.00"));

    TransferEvent event = transferService.submitTransfer(request);

    // ✅ Rejected with audit trail
    assertThat(event.getStatus()).isEqualTo(TransferStatus.FAILED_SAME_ACCOUNT);
    assertThat(event.getFailureReason()).contains("same account");
}

@Test
void shouldRejectInsufficientFunds() {
    Account alice = new Account("alice", new BigDecimal("100.00"));
    Account bob = new Account("bob", new BigDecimal("0.00"));
    accountRepository.saveAll(List.of(alice, bob));

    TransferRequest request = new TransferRequest(
        "key-4", "alice", "bob", new BigDecimal("999.00"));

    transferService.submitTransfer(request);
    TransferEvent event = transferService.executeTransfer("key-4");

    // ✅ Insufficient funds caught at domain level
    assertThat(event.getStatus())
        .isEqualTo(TransferStatus.FAILED_INSUFFICIENT_FUNDS);
    // Alice's balance unchanged
    assertThat(accountRepository.findById("alice").get().getBalance())
        .isEqualByComparingTo("100.00");
}
```

ZeroTrust runs his scan again. Every edge case returns a proper error with an audit trail. "Acceptable," he says. Then he opens a new ticket: "Add rate limiting." Classic ZeroTrust.

---

[← Chapter 5: Kafka](ch05-async-kafka.md) | [Chapter 7: You Ship It →](ch07-full-service.md)
