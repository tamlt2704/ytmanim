package com.bank.controller;

import com.bank.kafka.TransferProducer;
import com.bank.model.TransferEvent;
import com.bank.model.TransferRequest;
import com.bank.repository.TransferEventRepository;
import com.bank.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;
    private final TransferProducer transferProducer;
    private final TransferEventRepository transferEventRepository;

    public TransferController(TransferService transferService,
                              TransferProducer transferProducer,
                              TransferEventRepository transferEventRepository) {
        this.transferService = transferService;
        this.transferProducer = transferProducer;
        this.transferEventRepository = transferEventRepository;
    }

    /**
     * Async path: submit to Kafka for processing. Returns 202 Accepted.
     */
    @PostMapping("/async")
    public ResponseEntity<Map<String, String>> submitAsync(@Valid @RequestBody TransferRequest request) {
        transferProducer.send(request);
        return ResponseEntity.accepted().body(Map.of(
                "idempotencyKey", request.idempotencyKey(),
                "status", "ACCEPTED"
        ));
    }

    /**
     * Sync path: validate, persist, and execute immediately. Returns result.
     */
    @PostMapping("/sync")
    public ResponseEntity<TransferEvent> submitSync(@Valid @RequestBody TransferRequest request) {
        TransferEvent event = transferService.submitTransfer(request);
        if (event.getStatus() == com.bank.model.TransferStatus.PENDING) {
            event = transferService.executeTransfer(request.idempotencyKey());
        }
        return ResponseEntity.ok(event);
    }

    /**
     * Check transfer status by idempotency key.
     */
    @GetMapping("/{idempotencyKey}")
    public ResponseEntity<TransferEvent> getStatus(@PathVariable String idempotencyKey) {
        return transferEventRepository.findByIdempotencyKey(idempotencyKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
