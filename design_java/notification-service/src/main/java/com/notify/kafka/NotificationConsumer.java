package com.notify.kafka;

import com.notify.model.NotificationRequest;
import com.notify.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumer.class);

    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "${notification.topic}", groupId = "notification-group")
    public void consume(NotificationRequest request, Acknowledgment ack) {
        try {
            notificationService.process(request);
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process notification {}: {}", request.idempotencyKey(), e.getMessage());
            // Don't ack — will be redelivered
        }
    }
}
