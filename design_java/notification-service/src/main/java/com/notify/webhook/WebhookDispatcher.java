package com.notify.webhook;

import com.notify.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Observer pattern — dispatches delivery status callbacks to registered webhook URLs.
 * In production, this would make async HTTP calls with retry.
 */
@Component
public class WebhookDispatcher {

    private static final Logger log = LoggerFactory.getLogger(WebhookDispatcher.class);

    public void dispatch(Notification notification) {
        if (notification.getWebhookUrl() == null || notification.getWebhookUrl().isBlank()) {
            return;
        }

        log.info("Dispatching webhook to {} — notification {} status {}",
                notification.getWebhookUrl(),
                notification.getIdempotencyKey(),
                notification.getStatus());

        // In production: async HTTP POST to webhookUrl with notification status payload
        // Use WebClient or RestTemplate with retry and timeout
    }
}
