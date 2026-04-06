package com.notify.kafka;

import com.notify.model.NotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotificationProducer {

    private static final Logger log = LoggerFactory.getLogger(NotificationProducer.class);

    private final KafkaTemplate<String, NotificationRequest> kafkaTemplate;
    private final String topic;

    public NotificationProducer(KafkaTemplate<String, NotificationRequest> kafkaTemplate,
                                @Value("${notification.topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void send(NotificationRequest request) {
        kafkaTemplate.send(topic, request.userId(), request)
                .thenAccept(r -> log.debug("Notification {} queued", request.idempotencyKey()))
                .exceptionally(ex -> {
                    log.error("Failed to queue notification {}: {}", request.idempotencyKey(), ex.getMessage());
                    return null;
                });
    }
}
