package com.ordersystem.order.kafka;

import com.ordersystem.common.event.OrderEvent;
import com.ordersystem.common.event.Topics;
import com.ordersystem.order.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

/**
 * Saga orchestrator — listens to inventory and payment events to drive the order lifecycle.
 */
@Component
public class OrderSagaListener {

    private static final Logger log = LoggerFactory.getLogger(OrderSagaListener.class);

    private final OrderService orderService;

    public OrderSagaListener(OrderService orderService) {
        this.orderService = orderService;
    }

    @KafkaListener(topics = Topics.INVENTORY_EVENTS, groupId = "order-group")
    public void onInventoryEvent(OrderEvent event, Acknowledgment ack) {
        try {
            switch (event.type()) {
                case INVENTORY_RESERVED -> orderService.onInventoryReserved(event.orderId());
                case INVENTORY_FAILED -> orderService.onSagaFailed(event.orderId(), event.reason());
                default -> {}
            }
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process inventory event: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = Topics.PAYMENT_EVENTS, groupId = "order-group")
    public void onPaymentEvent(OrderEvent event, Acknowledgment ack) {
        try {
            switch (event.type()) {
                case PAYMENT_COMPLETED -> orderService.onPaymentCompleted(event.orderId());
                case PAYMENT_FAILED -> orderService.onSagaFailed(event.orderId(), event.reason());
                default -> {}
            }
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process payment event: {}", e.getMessage());
        }
    }
}
