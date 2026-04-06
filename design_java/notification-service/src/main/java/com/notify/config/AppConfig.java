package com.notify.config;

import com.notify.circuitbreaker.CircuitBreaker;
import com.notify.retry.RetryExecutor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class AppConfig {

    @Bean
    public RetryExecutor retryExecutor(
            @Value("${notification.retry.max-attempts}") int maxAttempts,
            @Value("${notification.retry.initial-delay-ms}") long initialDelayMs) {
        return new RetryExecutor(maxAttempts, initialDelayMs);
    }

    @Bean
    public CircuitBreaker.Registry circuitBreakerRegistry(
            @Value("${notification.circuit-breaker.failure-threshold}") int failureThreshold,
            @Value("${notification.circuit-breaker.reset-timeout-ms}") long resetTimeoutMs) {
        return new CircuitBreaker.Registry(failureThreshold, resetTimeoutMs);
    }

    @Bean
    public NewTopic notificationTopic(@Value("${notification.topic}") String topic) {
        return TopicBuilder.name(topic).partitions(5).replicas(1).build();
    }
}
