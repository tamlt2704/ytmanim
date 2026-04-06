package com.bank.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transfer_events", indexes = {
        @Index(name = "idx_idempotency_key", columnList = "idempotencyKey", unique = true)
})
public class TransferEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    @Column(nullable = false)
    private String fromAccountId;

    @Column(nullable = false)
    private String toAccountId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferStatus status;

    @Column
    private String failureReason;

    @Column(nullable = false)
    private Instant createdAt;

    @Column
    private Instant processedAt;

    public TransferEvent() {}

    public static TransferEvent from(TransferRequest request) {
        TransferEvent event = new TransferEvent();
        event.idempotencyKey = request.idempotencyKey();
        event.fromAccountId = request.fromAccountId();
        event.toAccountId = request.toAccountId();
        event.amount = request.amount();
        event.status = TransferStatus.PENDING;
        event.createdAt = Instant.now();
        return event;
    }

    public Long getId() { return id; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public String getFromAccountId() { return fromAccountId; }
    public String getToAccountId() { return toAccountId; }
    public BigDecimal getAmount() { return amount; }
    public TransferStatus getStatus() { return status; }
    public String getFailureReason() { return failureReason; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getProcessedAt() { return processedAt; }

    public void setStatus(TransferStatus status) { this.status = status; }
    public void setFailureReason(String reason) { this.failureReason = reason; }
    public void setProcessedAt(Instant processedAt) { this.processedAt = processedAt; }
}
