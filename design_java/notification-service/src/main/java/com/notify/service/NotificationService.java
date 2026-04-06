package com.notify.service;

import com.notify.channel.NotificationChannel;
import com.notify.channel.NotificationChannel.ChannelException;
import com.notify.circuitbreaker.CircuitBreaker;
import com.notify.model.*;
import com.notify.ratelimit.RateLimiter;
import com.notify.repository.NotificationRepository;
import com.notify.retry.RetryExecutor;
import com.notify.template.TemplateRenderer;
import com.notify.webhook.WebhookDispatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository repository;
    private final TemplateRenderer templateRenderer;
    private final RateLimiter rateLimiter;
    private final RetryExecutor retryExecutor;
    private final CircuitBreaker.Registry circuitBreakerRegistry;
    private final WebhookDispatcher webhookDispatcher;
    private final Map<Channel, NotificationChannel> channels;

    public NotificationService(NotificationRepository repository,
                               TemplateRenderer templateRenderer,
                               RateLimiter rateLimiter,
                               RetryExecutor retryExecutor,
                               CircuitBreaker.Registry circuitBreakerRegistry,
                               WebhookDispatcher webhookDispatcher,
                               List<NotificationChannel> channelList) {
        this.repository = repository;
        this.templateRenderer = templateRenderer;
        this.rateLimiter = rateLimiter;
        this.retryExecutor = retryExecutor;
        this.circuitBreakerRegistry = circuitBreakerRegistry;
        this.webhookDispatcher = webhookDispatcher;
        this.channels = channelList.stream()
                .collect(Collectors.toMap(NotificationChannel::getType, Function.identity()));
    }

    /**
     * Full pipeline: idempotency → template → rate limit → circuit breaker → retry → send → webhook
     */
    @Transactional
    public Notification process(NotificationRequest request) {
        // 1. Idempotency
        var existing = repository.findByIdempotencyKey(request.idempotencyKey());
        if (existing.isPresent()) {
            log.info("Duplicate notification: {}", request.idempotencyKey());
            return existing.get();
        }

        // 2. Template rendering
        if (!templateRenderer.templateExists(request.templateName())) {
            throw new IllegalArgumentException("Unknown template: " + request.templateName());
        }
        String content = templateRenderer.render(request.templateName(), request.templateParams());

        // 3. Persist as PENDING
        Notification notification;
        try {
            notification = repository.save(Notification.from(request, content));
        } catch (DataIntegrityViolationException e) {
            return repository.findByIdempotencyKey(request.idempotencyKey()).orElseThrow();
        }

        // 4. Rate limiting (CRITICAL priority bypasses)
        if (request.priority() != Priority.CRITICAL) {
            if (!rateLimiter.tryAcquire(request.userId(), request.idempotencyKey())) {
                notification.markRateLimited();
                repository.save(notification);
                webhookDispatcher.dispatch(notification);
                return notification;
            }
        }

        // 5. Circuit breaker check
        CircuitBreaker breaker = circuitBreakerRegistry.get(request.channel().name());
        if (!breaker.isCallPermitted()) {
            notification.markCircuitOpen();
            repository.save(notification);
            webhookDispatcher.dispatch(notification);
            return notification;
        }

        // 6. Send with retry
        NotificationChannel channel = channels.get(request.channel());
        if (channel == null) {
            notification.markFailed("Unsupported channel: " + request.channel());
            repository.save(notification);
            return notification;
        }

        try {
            int attempts = retryExecutor.executeWithRetry(() -> channel.send(notification));
            notification.incrementAttempt();
            notification.markSent();
            breaker.recordSuccess();
            log.info("Notification {} sent via {} after {} attempt(s)",
                    notification.getIdempotencyKey(), request.channel(), attempts);
        } catch (ChannelException e) {
            notification.incrementAttempt();
            notification.markFailed(e.getMessage());
            breaker.recordFailure();
            log.error("Notification {} failed: {}", notification.getIdempotencyKey(), e.getMessage());
        }

        repository.save(notification);
        webhookDispatcher.dispatch(notification);
        return notification;
    }

    public Notification getByIdempotencyKey(String key) {
        return repository.findByIdempotencyKey(key).orElse(null);
    }
}
