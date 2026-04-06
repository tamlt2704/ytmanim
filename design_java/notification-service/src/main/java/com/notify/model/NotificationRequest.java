package com.notify.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record NotificationRequest(
        @NotBlank String idempotencyKey,
        @NotBlank String userId,
        @NotNull Channel channel,
        @NotNull Priority priority,
        @NotBlank String templateName,
        Map<String, String> templateParams,
        String webhookUrl
) {}
