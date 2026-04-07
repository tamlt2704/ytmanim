package com.ordersystem.common.event;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderEvent(
        String eventId,
        String orderId,
        String userId,
        EventType type,
        String productId,
        int quantity,
        BigDecimal totalAmount,
        String reason,
        Instant timestamp
) {
    public enum EventType {
        ORDER_CREATED,
        INVENTORY_RESERVED,
        INVENTORY_FAILED,
        PAYMENT_COMPLETED,
        PAYMENT_FAILED,
        ORDER_CONFIRMED,
        ORDER_CANCELLED
    }
}
