package com.ordersystem.payment.service;

import com.ordersystem.payment.model.Payment;
import com.ordersystem.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PaymentServiceTest {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
    }

    @Test
    void shouldProcessPaymentSuccessfully() {
        Payment payment = paymentService.processPayment("order-1", "user1", new BigDecimal("99.99"));

        assertThat(payment.getStatus()).isEqualTo(Payment.PaymentStatus.COMPLETED);
        assertThat(payment.getOrderId()).isEqualTo("order-1");
    }

    @Test
    void shouldFailPaymentOverLimit() {
        Payment payment = paymentService.processPayment("order-2", "user1", new BigDecimal("15000.00"));

        assertThat(payment.getStatus()).isEqualTo(Payment.PaymentStatus.FAILED);
    }

    @Test
    void shouldBeIdempotent() {
        Payment first = paymentService.processPayment("order-3", "user1", new BigDecimal("50.00"));
        Payment second = paymentService.processPayment("order-3", "user1", new BigDecimal("50.00"));

        assertThat(first.getId()).isEqualTo(second.getId());
        assertThat(paymentRepository.findAll()).hasSize(1);
    }

    @Test
    void shouldRefundPayment() {
        paymentService.processPayment("order-4", "user1", new BigDecimal("100.00"));

        paymentService.refund("order-4");

        Payment refunded = paymentRepository.findByOrderId("order-4").orElseThrow();
        assertThat(refunded.getStatus()).isEqualTo(Payment.PaymentStatus.REFUNDED);
    }

    @Test
    void shouldHandleRefundForNonexistentOrder() {
        // Should not throw
        paymentService.refund("nonexistent");
    }

    @Test
    void shouldGetPaymentByOrderId() {
        paymentService.processPayment("order-5", "user1", new BigDecimal("75.00"));

        var found = paymentService.getByOrderId("order-5");
        assertThat(found).isPresent();
        assertThat(found.get().getAmount()).isEqualByComparingTo("75.00");
    }
}
