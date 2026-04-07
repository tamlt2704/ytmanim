package com.ordersystem.order.controller;

import com.ordersystem.order.model.Order;
import com.ordersystem.order.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    public record CreateOrderRequest(
            @NotBlank String idempotencyKey,
            @NotBlank String userId,
            @NotBlank String productId,
            @Min(1) int quantity,
            @NotNull @DecimalMin("0.01") BigDecimal totalAmount
    ) {}

    @PostMapping
    public ResponseEntity<Order> create(@Valid @RequestBody CreateOrderRequest req) {
        Order order = orderService.createOrder(
                req.idempotencyKey(), req.userId(), req.productId(),
                req.quantity(), req.totalAmount());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> get(@PathVariable String orderId) {
        return orderService.getOrder(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
