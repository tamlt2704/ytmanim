package com.notify.template;

import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Simple template renderer — replaces {{key}} placeholders with values.
 * In production, use Thymeleaf, FreeMarker, or a dedicated template engine.
 */
@Component
public class TemplateRenderer {

    private static final Map<String, String> TEMPLATES = Map.of(
            "welcome", "Welcome {{name}}! Your account is ready.",
            "otp", "Your verification code is {{code}}. Expires in {{expiry}} minutes.",
            "alert", "ALERT: {{message}}",
            "payment", "Payment of ${{amount}} to {{recipient}} was {{status}}.",
            "reminder", "Reminder: {{message}}"
    );

    public String render(String templateName, Map<String, String> params) {
        String template = TEMPLATES.get(templateName);
        if (template == null) {
            throw new IllegalArgumentException("Unknown template: " + templateName);
        }
        if (params == null) return template;

        String result = template;
        for (var entry : params.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }

    public boolean templateExists(String templateName) {
        return TEMPLATES.containsKey(templateName);
    }
}
