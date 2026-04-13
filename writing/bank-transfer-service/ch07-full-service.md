# Chapter 7: You Ship It — Compliance Signs Off

[← Chapter 6: Validation](ch06-validation.md) | [Series Overview](README.md)

---

## The Final Version

Six incidents. Six fixes. Each one taught you something about building financial systems that no tutorial could:

- A double-spend taught you pessimistic locking (Chapter 2)
- A deadlock taught you ordered lock acquisition (Chapter 3)
- A retry taught you idempotency keys (Chapter 4)
- A melted database taught you async processing with Kafka (Chapter 5)
- A negative transfer taught you multi-layer validation (Chapter 6)

Now you combine everything into the final service.

## The Architecture

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
                                     │       PostgreSQL       │
                                     │                        │
                                     │  accounts (+ @Version) │
                                     │  transfer_events       │
                                     │   (unique idempotency) │
                                     └────────────────────────┘
```

## The Full TransferService

```java
// src/main/java/com/bank/service/TransferService.java
package com.bank.service;

import com.bank.model.*;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransferEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class TransferService {

    private static final Logger log = LoggerFactory.getLogger(TransferService.class);

    private final AccountRepository accountRepository;
    private final TransferEventRepository transferEventRepository;

    public TransferService(AccountRepository accountRepository,
                           TransferEventRepository transferEventRepository) {
        this.accountRepository = accountRepository;
        this.transferEventRepository = transferEventRepository;
    }

    // Ch.4: Idempotent submission
    @Transactional
    public TransferEvent submitTransfer(TransferRequest request) {
        var existing = transferEventRepository
            .findByIdempotencyKey(request.idempotencyKey());
        if (existing.isPresent()) {
            return existing.get();
        }

        // Ch.6: Business validation
        if (request.fromAccountId().equals(request.toAccountId())) {
            return persistFailedEvent(request, TransferStatus.FAILED_SAME_ACCOUNT,
                    "Cannot transfer to the same account");
        }
        if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            return persistFailedEvent(request, TransferStatus.FAILED_INVALID_AMOUNT,
                    "Amount must be positive");
        }

        TransferEvent event = TransferEvent.from(request);
        try {
            return transferEventRepository.save(event);
        } catch (DataIntegrityViolationException e) {
            // Ch.4: Race condition on idempotency key
            return transferEventRepository
                .findByIdempotencyKey(request.idempotencyKey()).orElseThrow();
        }
    }

    // Ch.2: Pessimistic locking  |  Ch.3: Ordered lock acquisition
    @Transactional
    public TransferEvent executeTransfer(String idempotencyKey) {
        TransferEvent event = transferEventRepository
            .findByIdempotencyKey(idempotencyKey).orElseThrow();

        // Ch.4: Already processed — idempotent
        if (event.getStatus() != TransferStatus.PENDING) {
            return event;
        }

        // Ch.3: Lock in consistent order — prevents deadlocks
        String firstId = event.getFromAccountId().compareTo(event.getToAccountId()) < 0
                ? event.getFromAccountId() : event.getToAccountId();
        String secondId = event.getFromAccountId().compareTo(event.getToAccountId()) < 0
                ? event.getToAccountId() : event.getFromAccountId();

        var firstAccount = accountRepository.findByIdForUpdate(firstId);
        var secondAccount = accountRepository.findByIdForUpdate(secondId);

        var fromAccount = event.getFromAccountId().equals(firstId)
                ? firstAccount : secondAccount;
        var toAccount = event.getToAccountId().equals(firstId)
                ? firstAccount : secondAccount;

        if (fromAccount.isEmpty()) {
            return failEvent(event, TransferStatus.FAILED_ACCOUNT_NOT_FOUND,
                    "Source account not found: " + event.getFromAccountId());
        }
        if (toAccount.isEmpty()) {
            return failEvent(event, TransferStatus.FAILED_ACCOUNT_NOT_FOUND,
                    "Destination account not found: " + event.getToAccountId());
        }

        // Ch.6: Domain validation — last line of defense
        try {
            fromAccount.get().debit(event.getAmount());
            toAccount.get().credit(event.getAmount());
        } catch (Account.InsufficientFundsException e) {
            return failEvent(event, TransferStatus.FAILED_INSUFFICIENT_FUNDS,
                    e.getMessage());
        }

        event.setStatus(TransferStatus.COMPLETED);
        event.setProcessedAt(Instant.now());
        return transferEventRepository.save(event);
    }

    private TransferEvent persistFailedEvent(TransferRequest request,
            TransferStatus status, String reason) {
        TransferEvent event = TransferEvent.from(request);
        event.setStatus(status);
        event.setFailureReason(reason);
        event.setProcessedAt(Instant.now());
        return transferEventRepository.save(event);
    }

    private TransferEvent failEvent(TransferEvent event,
            TransferStatus status, String reason) {
        event.setStatus(status);
        event.setFailureReason(reason);
        event.setProcessedAt(Instant.now());
        return transferEventRepository.save(event);
    }
}
```

## Run All 23 Tests

```bash
./gradlew test
```

Green. All 23.

## The Meeting

Linus calls a meeting. You, Bobby Tables, ZeroTrust, FiveNines, TicketMaster, NullPointer — the whole crew.

Linus pulls up the test results. "23 tests. Pessimistic locking, ordered acquisition, idempotency, Kafka buffering, multi-layer validation. BigDecimal everywhere." He looks at Bobby Tables. Bobby nods.

ZeroTrust speaks up. "I tried negative amounts, zero amounts, same-account transfers, duplicate keys, concurrent overdrafts. Everything returns a proper error with an audit trail." He pauses. "Acceptable."

FiveNines shows the dashboard. "80,000 TPS peak. Kafka absorbed the spike. Database stayed at 40% connection usage. 99.999% uptime." He's smiling. FiveNines never smiles.

TicketMaster closes her laptop. "Zero customer complaints since the last deploy. I'm running out of tickets to file." She opens a new one anyway: "Add transfer history endpoint."

Linus looks at you. "Ship it."

You push the final commit.

## Key Design Decisions

| Decision | Why | Chapter |
|----------|-----|---------|
| `SELECT FOR UPDATE` (pessimistic locking) | Prevents double-spending under concurrency | 2 |
| Ordered lock acquisition (alphabetical by account ID) | Prevents deadlocks in bidirectional transfers | 3 |
| Idempotency key with unique DB index | Handles retries, Kafka redelivery, duplicate submissions | 4 |
| Kafka partitioned by sender account | Decouples ingestion from processing, serializes per-account | 5 |
| Manual consumer ack + idempotency | At-least-once + idempotency = effectively exactly-once | 5 |
| Multi-layer validation (bean → service → domain) | Defense in depth, audit trail for failures | 6 |
| `BigDecimal` for money | No floating-point rounding errors | 1 |
| `@Version` on Account | Optimistic locking safety net | 1 |

---

You're not an intern anymore. You're the person who built the system that moves money.

NullPointer walks by. "Hey, the data pipeline needs a batch processing engine. Interested?"

You stare at your coffee. "How hard can it be?"

---

[← Chapter 6: Validation](ch06-validation.md) | [Series Overview](README.md)
