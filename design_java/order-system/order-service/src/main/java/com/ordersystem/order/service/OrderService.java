package com.ordersystem.order.service;

import com.ordersystem.common.event.OrderEvent;
import com.ordersystem.common.event.Topics;
import com.ordersystem.order.model.Order;
import com.ordersystem.order.model.OrderStatus;
import com.ordersystem.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository repository;
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public OrderService(OrderRepository repository, KafkaTemplate<String, OrderEvent> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Step 1 of the saga: create order and publish ORDER_CREATED event.
     */
    @Transactional
    public Order createOrder(String idempotencyKey, String userId, String productId,
                             int quantity, BigDecimal totalAmount) {
        // Idempotency check
        Optional<Order> existing = repository.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) return existing.get();

        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, idempotencyKey, userId, productId, quantity, totalAmount);

        try {
            order = repository.save(order);
        } catch (DataIntegrityViolationException e) {
            return repository.findByIdempotencyKey(idempotencyKey).orElseThrow();
        }

        // Publish saga start event
        OrderEvent event = new OrderEvent(
                UUID.randomUUID().toString(), orderId, userId,
                OrderEvent.EventType.ORDER_CREATED,
                productId, quantity, totalAmount, null, Instant.now()
        );
        kafkaTemplate.send(Topics.ORDER_EVENTS, orderId, event);
        log.info("Order {} created, saga started", orderId);

        return order;
    }

    /**
     * Step 2: inventory reserved → request payment.
     */
    @Transactional
    public void onInventoryReserved(String orderId) {
        repository.findById(orderId).ifPresent(order -> {
            order.updateStatus(OrderStatus.INVENTORY_RESERVED);
            repository.save(order);

            // Publish payment request
            OrderEvent event = new OrderEvent(
                    UUID.randomUUID().toString(), orderId, order.getUserId(),
                    OrderEvent.EventType.INVENTORY_RESERVED,
                    order.getProductId(), order.getQuantity(), order.getTotalAmount(),
                    null, Instant.now()
            );
            kafkaTemplate.send(Topics.PAYMENT_EVENTS, orderId, event);
            log.info("Order {} inventory reserved, requesting payment", orderId);
        });
    }

    /**
     * Step 3: payment completed → confirm order.
     */
    @Transactional
    public void onPaymentCompleted(String orderId) {
        repository.findById(orderId).ifPresent(order -> {
            order.updateStatus(OrderStatus.CONFIRMED);
            repository.save(order);
            log.info("Order {} confirmed", orderId);
        });
    }

    /**
     * Compensation: inventory or payment failed → cancel order and trigger rollback.
     */
    @Transactional
    public void onSagaFailed(String orderId, String reason) {
        repository.findById(orderId).ifPresent(order -> {
            order.fail(reason);
            repository.save(order);

            // Publish cancellation for compensating transactions
            OrderEvent cancelEvent = new OrderEvent(
                    UUID.randomUUID().toString(), orderId, order.getUserId(),
                    OrderEvent.EventType.ORDER_CANCELLED,
                    order.getProductId(), order.getQuantity(), order.getTotalAmount(),
                    reason, Instant.now()
            );
            kafkaTemplate.send(Topics.ORDER_EVENTS, orderId, cancelEvent);
            log.info("Order {} failed: {}", orderId, reason);
        });
    }

    public Optional<Order> getOrder(String orderId) {
        return repository.findById(orderId);
    }
}
