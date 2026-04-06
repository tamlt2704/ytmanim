package com.bank.kafka;

import com.bank.model.TransferRequest;
import com.bank.model.TransferStatus;
import com.bank.service.TransferService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class TransferConsumer {

    private static final Logger log = LoggerFactory.getLogger(TransferConsumer.class);

    private final TransferService transferService;

    public TransferConsumer(TransferService transferService) {
        this.transferService = transferService;
    }

    @KafkaListener(topics = "${transfer.topic}", groupId = "bank-transfer-group")
    public void consume(TransferRequest request, Acknowledgment ack) {
        try {
            log.debug("Processing transfer: {}", request.idempotencyKey());

            // Submit (idempotent) then execute
            var event = transferService.submitTransfer(request);

            if (event.getStatus() == TransferStatus.PENDING) {
                transferService.executeTransfer(request.idempotencyKey());
            }

            ack.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process transfer {}: {}", request.idempotencyKey(), e.getMessage(), e);
            // Don't ack — message will be redelivered for retry
        }
    }
}
