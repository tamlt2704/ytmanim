package com.ordersystem.product.kafka;

import com.ordersystem.common.event.OrderEvent;
import com.ordersystem.common.event.Topics;
import com.ordersystem.product.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class InventoryEventListener {

    private static final Logger log = LoggerFactory.getLogger(InventoryEventListener.class);

    private final ProductService productService;
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public InventoryEventListener(ProductService productService,
                                  KafkaTemplate<String, OrderEvent> kafkaTemplate) {
        this.productService = productService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = Topics.ORDER_EVENTS, groupId = "product-group")
    public void onOrderEvent(OrderEvent event, Acknowledgment ack) {
        try {
            switch (event.type()) {
                case ORDER_CREATED -> handleOrderCreated(event);
                case ORDER_CANCELLED -> handleOrderCancelled(event);
                default -> log.debug("Ignoring event type: {}", event.type());
            }
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process event {}: {}", event.eventId(), e.getMessage());
        }
    }

    private void handleOrderCreated(OrderEvent event) {
        boolean reserved = productService.reserveInventory(event.productId(), event.quantity());

        OrderEvent response = new OrderEvent(
                UUID.randomUUID().toString(),
                event.orderId(),
                event.userId(),
                reserved ? OrderEvent.EventType.INVENTORY_RESERVED : OrderEvent.EventType.INVENTORY_FAILED,
                event.productId(),
                event.quantity(),
                event.totalAmount(),
                reserved ? null : "Insufficient stock",
                Instant.now()
        );

        kafkaTemplate.send(Topics.INVENTORY_EVENTS, event.orderId(), response);
    }

    private void handleOrderCancelled(OrderEvent event) {
        productService.releaseInventory(event.productId(), event.quantity());
        log.info("Released inventory for cancelled order {}", event.orderId());
    }
}
