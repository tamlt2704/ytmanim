package com.ordersystem.order.service;

import com.ordersystem.order.model.Order;
import com.ordersystem.order.model.OrderStatus;
import com.ordersystem.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }

    @Test
    void shouldCreateOrder() {
        Order order = orderService.createOrder("key-1", "user1", "P1", 2, new BigDecimal("100.00"));

        assertThat(order.getStatus()).isEqualTo(OrderStatus.CREATED);
        assertThat(order.getUserId()).isEqualTo("user1");
        assertThat(order.getProductId()).isEqualTo("P1");
        assertThat(order.getQuantity()).isEqualTo(2);
    }

    @Test
    void shouldBeIdempotent() {
        Order first = orderService.createOrder("dup-key", "user1", "P1", 1, new BigDecimal("50.00"));
        Order second = orderService.createOrder("dup-key", "user1", "P1", 1, new BigDecimal("50.00"));

        assertThat(first.getId()).isEqualTo(second.getId());
        assertThat(orderRepository.findAll()).hasSize(1);
    }

    @Test
    void shouldTransitionOnInventoryReserved() {
        Order order = orderService.createOrder("key-2", "user1", "P1", 1, new BigDecimal("50.00"));

        orderService.onInventoryReserved(order.getId());

        Order updated = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(OrderStatus.INVENTORY_RESERVED);
    }

    @Test
    void shouldConfirmOnPaymentCompleted() {
        Order order = orderService.createOrder("key-3", "user1", "P1", 1, new BigDecimal("50.00"));
        orderService.onInventoryReserved(order.getId());

        orderService.onPaymentCompleted(order.getId());

        Order updated = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }

    @Test
    void shouldFailOnSagaFailure() {
        Order order = orderService.createOrder("key-4", "user1", "P1", 1, new BigDecimal("50.00"));

        orderService.onSagaFailed(order.getId(), "Insufficient stock");

        Order updated = orderRepository.findById(order.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(OrderStatus.FAILED);
        assertThat(updated.getFailureReason()).isEqualTo("Insufficient stock");
    }

    @Test
    void shouldGetOrder() {
        Order order = orderService.createOrder("key-5", "user1", "P1", 1, new BigDecimal("50.00"));

        var found = orderService.getOrder(order.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getIdempotencyKey()).isEqualTo("key-5");
    }

    @Test
    void shouldReturnEmptyForNonexistentOrder() {
        assertThat(orderService.getOrder("nonexistent")).isEmpty();
    }
}
