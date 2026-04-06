package com.notify.service;

import com.notify.model.*;
import com.notify.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    private NotificationRequest request(String userId, Channel channel, Priority priority,
                                        String template, Map<String, String> params) {
        return new NotificationRequest(
                UUID.randomUUID().toString(), userId, channel, priority, template, params, null);
    }

    private NotificationRequest requestWithKey(String key, String userId, Channel channel,
                                               String template, Map<String, String> params) {
        return new NotificationRequest(key, userId, channel, Priority.NORMAL, template, params, null);
    }

    @Nested
    class HappyPath {

        @Test
        void shouldSendEmailNotification() {
            var req = request("user1", Channel.EMAIL, Priority.NORMAL,
                    "welcome", Map.of("name", "Alice"));
            Notification result = notificationService.process(req);

            assertThat(result.getStatus()).isEqualTo(DeliveryStatus.SENT);
            assertThat(result.getRenderedContent()).isEqualTo("Welcome Alice! Your account is ready.");
            assertThat(result.getChannel()).isEqualTo(Channel.EMAIL);
        }

        @Test
        void shouldSendSmsNotification() {
            var req = request("user1", Channel.SMS, Priority.NORMAL,
                    "otp", Map.of("code", "999888", "expiry", "10"));
            Notification result = notificationService.process(req);

            assertThat(result.getStatus()).isEqualTo(DeliveryStatus.SENT);
            assertThat(result.getRenderedContent()).contains("999888");
        }

        @Test
        void shouldSendPushNotification() {
            var req = request("user1", Channel.PUSH, Priority.NORMAL,
                    "alert", Map.of("message", "Server is down"));
            Notification result = notificationService.process(req);

            assertThat(result.getStatus()).isEqualTo(DeliveryStatus.SENT);
            assertThat(result.getRenderedContent()).isEqualTo("ALERT: Server is down");
        }

        @Test
        void shouldRecordSentTimestamp() {
            var req = request("user1", Channel.EMAIL, Priority.NORMAL,
                    "welcome", Map.of("name", "Bob"));
            Notification result = notificationService.process(req);

            assertThat(result.getSentAt()).isNotNull();
            assertThat(result.getCreatedAt()).isNotNull();
            assertThat(result.getSentAt()).isAfterOrEqualTo(result.getCreatedAt());
        }
    }

    @Nested
    class Idempotency {

        @Test
        void shouldReturnExistingForDuplicateKey() {
            var req = requestWithKey("dup-1", "user1", Channel.EMAIL,
                    "welcome", Map.of("name", "Alice"));

            Notification first = notificationService.process(req);
            Notification second = notificationService.process(req);

            assertThat(first.getId()).isEqualTo(second.getId());
            assertThat(repository.findAll()).hasSize(1);
        }
    }

    @Nested
    class Validation {

        @Test
        void shouldRejectUnknownTemplate() {
            var req = request("user1", Channel.EMAIL, Priority.NORMAL,
                    "nonexistent", Map.of());

            assertThatThrownBy(() -> notificationService.process(req))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Unknown template");
        }
    }

    @Nested
    class RateLimiting {

        @Test
        void shouldRateLimitAfterThreshold() {
            // Send max-per-window (10) notifications
            for (int i = 0; i < 10; i++) {
                var req = request("rate-user", Channel.EMAIL, Priority.NORMAL,
                        "welcome", Map.of("name", "User" + i));
                Notification result = notificationService.process(req);
                assertThat(result.getStatus()).isEqualTo(DeliveryStatus.SENT);
            }

            // 11th should be rate limited
            var req = request("rate-user", Channel.EMAIL, Priority.NORMAL,
                    "welcome", Map.of("name", "Overflow"));
            Notification result = notificationService.process(req);
            assertThat(result.getStatus()).isEqualTo(DeliveryStatus.RATE_LIMITED);
        }

        @Test
        void shouldBypassRateLimitForCriticalPriority() {
            // Fill up the rate limit
            for (int i = 0; i < 10; i++) {
                var req = request("critical-user", Channel.EMAIL, Priority.NORMAL,
                        "welcome", Map.of("name", "User" + i));
                notificationService.process(req);
            }

            // CRITICAL should bypass
            var req = request("critical-user", Channel.EMAIL, Priority.CRITICAL,
                    "alert", Map.of("message", "System failure"));
            Notification result = notificationService.process(req);
            assertThat(result.getStatus()).isEqualTo(DeliveryStatus.SENT);
        }

        @Test
        void shouldNotRateLimitDifferentUsers() {
            // Fill user1's limit
            for (int i = 0; i < 10; i++) {
                var req = request("limit-user1", Channel.EMAIL, Priority.NORMAL,
                        "welcome", Map.of("name", "U" + i));
                notificationService.process(req);
            }

            // user2 should still be allowed
            var req = request("limit-user2", Channel.EMAIL, Priority.NORMAL,
                    "welcome", Map.of("name", "Other"));
            Notification result = notificationService.process(req);
            assertThat(result.getStatus()).isEqualTo(DeliveryStatus.SENT);
        }
    }

    @Nested
    class StatusLookup {

        @Test
        void shouldFindByIdempotencyKey() {
            var req = requestWithKey("lookup-1", "user1", Channel.EMAIL,
                    "welcome", Map.of("name", "Alice"));
            notificationService.process(req);

            Notification found = notificationService.getByIdempotencyKey("lookup-1");
            assertThat(found).isNotNull();
            assertThat(found.getStatus()).isEqualTo(DeliveryStatus.SENT);
        }

        @Test
        void shouldReturnNullForUnknownKey() {
            assertThat(notificationService.getByIdempotencyKey("nonexistent")).isNull();
        }
    }
}
