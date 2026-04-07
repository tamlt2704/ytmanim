package com.ordersystem.order.model;

public enum OrderStatus {
    CREATED,
    INVENTORY_RESERVED,
    PAYMENT_PENDING,
    CONFIRMED,
    CANCELLED,
    FAILED
}
