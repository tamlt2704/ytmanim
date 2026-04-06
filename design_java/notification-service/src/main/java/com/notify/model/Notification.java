package com.notify.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_idempotency", columnList = "idempotencyKey", unique = true),
        @Index(name = "idx_user_status", columnList = "userId, status")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Channel channel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Column(nullable = false)
    private String templateName;

    @Column(columnDefinition = "TEXT")
    private String renderedContent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status;

    private int attemptCount;
    private String failureReason;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant sentAt;

    private String webhookUrl;

    public Notification() {}

    public static Notification from(NotificationRequest req, String renderedContent) {
        Notification n = new Notification();
        n.idempotencyKey = req.idempotencyKey();
        n.userId = req.userId();
        n.channel = req.channel();
        n.priority = req.priority();
        n.templateName = req.templateName();
        n.renderedContent = renderedContent;
        n.status = DeliveryStatus.PENDING;
        n.attemptCount = 0;
        n.createdAt = Instant.now();
        n.webhookUrl = req.webhookUrl();
        return n;
    }

    // Getters
    public Long getId() { return id; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public String getUserId() { return userId; }
    public Channel getChannel() { return channel; }
    public Priority getPriority() { return priority; }
    public String getTemplateName() { return templateName; }
    public String getRenderedContent() { return renderedContent; }
    public DeliveryStatus getStatus() { return status; }
    public int getAttemptCount() { return attemptCount; }
    public String getFailureReason() { return failureReason; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getSentAt() { return sentAt; }
    public String getWebhookUrl() { return webhookUrl; }

    // Status transitions
    public void markSent() {
        this.status = DeliveryStatus.SENT;
        this.sentAt = Instant.now();
    }

    public void markFailed(String reason) {
        this.status = DeliveryStatus.FAILED;
        this.failureReason = reason;
    }

    public void markRateLimited() {
        this.status = DeliveryStatus.RATE_LIMITED;
    }

    public void markCircuitOpen() {
        this.status = DeliveryStatus.CIRCUIT_OPEN;
    }

    public void incrementAttempt() {
        this.attemptCount++;
    }
}
