package com.bank.kafka;

import com.bank.model.TransferRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class TransferProducer {

    private static final Logger log = LoggerFactory.getLogger(TransferProducer.class);

    private final KafkaTemplate<String, TransferRequest> kafkaTemplate;
    private final String topic;

    public TransferProducer(KafkaTemplate<String, TransferRequest> kafkaTemplate,
                            @Value("${transfer.topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    /**
     * Publishes transfer request to Kafka, keyed by fromAccountId for partition ordering.
     * This ensures all transfers from the same account are processed sequentially.
     */
    public CompletableFuture<Void> send(TransferRequest request) {
        return kafkaTemplate.send(topic, request.fromAccountId(), request)
                .thenAccept(result -> log.debug("Transfer {} sent to partition {}",
                        request.idempotencyKey(),
                        result.getRecordMetadata().partition()))
                .exceptionally(ex -> {
                    log.error("Failed to send transfer {}: {}", request.idempotencyKey(), ex.getMessage());
                    return null;
                });
    }
}
