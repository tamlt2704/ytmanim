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

    /**
     * Validates and records a transfer request. Returns the persisted event.
     * Idempotent — duplicate idempotencyKeys return the existing event.
     */
    @Transactional
    public TransferEvent submitTransfer(TransferRequest request) {
        // Idempotency check
        var existing = transferEventRepository.findByIdempotencyKey(request.idempotencyKey());
        if (existing.isPresent()) {
            log.info("Duplicate transfer request: {}", request.idempotencyKey());
            return existing.get();
        }

        // Validate same-account transfer
        if (request.fromAccountId().equals(request.toAccountId())) {
            return persistFailedEvent(request, TransferStatus.FAILED_SAME_ACCOUNT,
                    "Cannot transfer to the same account");
        }

        // Validate amount
        if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            return persistFailedEvent(request, TransferStatus.FAILED_INVALID_AMOUNT,
                    "Amount must be positive");
        }

        // Persist as PENDING — will be processed by Kafka consumer
        TransferEvent event = TransferEvent.from(request);
        try {
            return transferEventRepository.save(event);
        } catch (DataIntegrityViolationException e) {
            // Race condition: another thread inserted the same idempotencyKey
            log.info("Concurrent duplicate detected: {}", request.idempotencyKey());
            return transferEventRepository.findByIdempotencyKey(request.idempotencyKey())
                    .orElseThrow();
        }
    }

    /**
     * Executes the actual balance transfer. Called by the Kafka consumer.
     * Uses pessimistic locking with ordered lock acquisition to prevent deadlocks.
     */
    @Transactional
    public TransferEvent executeTransfer(String idempotencyKey) {
        TransferEvent event = transferEventRepository.findByIdempotencyKey(idempotencyKey)
                .orElseThrow(() -> new IllegalStateException("Transfer event not found: " + idempotencyKey));

        // Already processed — idempotent
        if (event.getStatus() != TransferStatus.PENDING) {
            return event;
        }

        // Lock accounts in consistent order to prevent deadlocks
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

        try {
            fromAccount.get().debit(event.getAmount());
            toAccount.get().credit(event.getAmount());
        } catch (Account.InsufficientFundsException e) {
            return failEvent(event, TransferStatus.FAILED_INSUFFICIENT_FUNDS, e.getMessage());
        }

        event.setStatus(TransferStatus.COMPLETED);
        event.setProcessedAt(Instant.now());
        return transferEventRepository.save(event);
    }

    private TransferEvent persistFailedEvent(TransferRequest request, TransferStatus status, String reason) {
        TransferEvent event = TransferEvent.from(request);
        event.setStatus(status);
        event.setFailureReason(reason);
        event.setProcessedAt(Instant.now());
        return transferEventRepository.save(event);
    }

    private TransferEvent failEvent(TransferEvent event, TransferStatus status, String reason) {
        event.setStatus(status);
        event.setFailureReason(reason);
        event.setProcessedAt(Instant.now());
        return transferEventRepository.save(event);
    }
}
