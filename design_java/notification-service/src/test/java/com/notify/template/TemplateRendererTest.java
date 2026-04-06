package com.notify.template;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;

class TemplateRendererTest {

    private final TemplateRenderer renderer = new TemplateRenderer();

    @Test
    void shouldRenderTemplateWithParams() {
        String result = renderer.render("welcome", Map.of("name", "Alice"));
        assertThat(result).isEqualTo("Welcome Alice! Your account is ready.");
    }

    @Test
    void shouldRenderOtpTemplate() {
        String result = renderer.render("otp", Map.of("code", "123456", "expiry", "5"));
        assertThat(result).isEqualTo("Your verification code is 123456. Expires in 5 minutes.");
    }

    @Test
    void shouldRenderWithNullParams() {
        String result = renderer.render("alert", null);
        assertThat(result).isEqualTo("ALERT: {{message}}");
    }

    @Test
    void shouldThrowForUnknownTemplate() {
        assertThatThrownBy(() -> renderer.render("nonexistent", Map.of()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown template");
    }

    @Test
    void shouldCheckTemplateExists() {
        assertThat(renderer.templateExists("welcome")).isTrue();
        assertThat(renderer.templateExists("nonexistent")).isFalse();
    }
}
