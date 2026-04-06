package com.notify.controller;

import com.notify.kafka.NotificationProducer;
import com.notify.model.Notification;
import com.notify.model.NotificationRequest;
import com.notify.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationProducer notificationProducer;

    public NotificationController(NotificationService notificationService,
                                  NotificationProducer notificationProducer) {
        this.notificationService = notificationService;
        this.notificationProducer = notificationProducer;
    }

    @PostMapping("/sync")
    public ResponseEntity<Notification> sendSync(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.process(request));
    }

    @PostMapping("/async")
    public ResponseEntity<Map<String, String>> sendAsync(@Valid @RequestBody NotificationRequest request) {
        notificationProducer.send(request);
        return ResponseEntity.accepted().body(Map.of(
                "idempotencyKey", request.idempotencyKey(),
                "status", "ACCEPTED"
        ));
    }

    @GetMapping("/{idempotencyKey}")
    public ResponseEntity<Notification> getStatus(@PathVariable String idempotencyKey) {
        Notification n = notificationService.getByIdempotencyKey(idempotencyKey);
        return n != null ? ResponseEntity.ok(n) : ResponseEntity.notFound().build();
    }
}
