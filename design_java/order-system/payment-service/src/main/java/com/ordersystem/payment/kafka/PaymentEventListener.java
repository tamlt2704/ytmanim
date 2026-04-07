package com.ordersystem.payment.kafka;

import com.ordersystem.common.event.OrderEvent;
import com.ordersystem.common.event.Topics;
import com.ordersystem.payment.model.Payment;
import com.ordersystem.payment.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    private final PaymentService paymentService;
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public PaymentEventListener(PaymentService paymentService,
                                KafkaTemplate<String, OrderEvent> kafkaTemplate) {
        this.paymentService = paymentService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = Topics.PAYMENT_EVENTS, groupId = "payment-group")
    public void onPaymentEvent(OrderEvent event, Acknowledgment ack) {
        try {
            switch (event.type()) {
                case INVENTORY_RESERVED -> handlePaymentRequest(event);
                case ORDER_CANCELLED -> paymentService.refund(event.orderId());
                default -> {}
            }
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process payment event: {}", e.getMessage());
        }
    }

    private void handlePaymentRequest(OrderEvent event) {
        Payment payment = paymentService.processPayment(
                event.orderId(), event.userId(), event.totalAmount());

        boolean success = payment.getStatus() == Payment.PaymentStatus.COMPLETED;

        OrderEvent response = new OrderEvent(
                UUID.randomUUID().toString(),
                event.orderId(),
                event.userId(),
                success ? OrderEvent.EventType.PAYMENT_COMPLETED : OrderEvent.EventType.PAYMENT_FAILED,
                event.productId(),
                event.quantity(),
                event.totalAmount(),
                success ? null : "Payment declined",
                Instant.now()
        );

        kafkaTemplate.send(Topics.PAYMENT_EVENTS, event.orderId(), response);
    }
}
