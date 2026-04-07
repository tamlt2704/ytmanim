package com.ordersystem.payment.service;

import com.ordersystem.payment.model.Payment;
import com.ordersystem.payment.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    /**
     * Process payment. Idempotent — duplicate orderId returns existing payment.
     * Simulates payment processing (always succeeds for amounts < 10000).
     */
    @Transactional
    public Payment processPayment(String orderId, String userId, BigDecimal amount) {
        // Idempotency
        Optional<Payment> existing = repository.findByOrderId(orderId);
        if (existing.isPresent()) return existing.get();

        Payment payment = new Payment(orderId, userId, amount);

        try {
            payment = repository.save(payment);
        } catch (DataIntegrityViolationException e) {
            return repository.findByOrderId(orderId).orElseThrow();
        }

        // Simulate payment gateway
        if (amount.compareTo(new BigDecimal("10000")) < 0) {
            payment.complete();
            log.info("Payment completed for order {} amount {}", orderId, amount);
        } else {
            payment.fail();
            log.warn("Payment failed for order {} — amount {} exceeds limit", orderId, amount);
        }

        return repository.save(payment);
    }

    @Transactional
    public void refund(String orderId) {
        repository.findByOrderId(orderId).ifPresent(payment -> {
            payment.refund();
            repository.save(payment);
            log.info("Payment refunded for order {}", orderId);
        });
    }

    public Optional<Payment> getByOrderId(String orderId) {
        return repository.findByOrderId(orderId);
    }
}
