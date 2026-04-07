package com.ordersystem.order.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_idempotency", columnList = "idempotencyKey", unique = true)
})
public class Order {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    private String failureReason;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant updatedAt;

    public Order() {}

    public Order(String id, String idempotencyKey, String userId, String productId,
                 int quantity, BigDecimal totalAmount) {
        this.id = id;
        this.idempotencyKey = idempotencyKey;
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.status = OrderStatus.CREATED;
        this.createdAt = Instant.now();
    }

    public void updateStatus(OrderStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public void fail(String reason) {
        this.status = OrderStatus.FAILED;
        this.failureReason = reason;
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public String getUserId() { return userId; }
    public String getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public String getFailureReason() { return failureReason; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
