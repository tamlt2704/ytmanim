package com.notify.ratelimit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

/**
 * Redis sliding window rate limiter.
 * Uses a sorted set per user — scores are timestamps, members are unique request IDs.
 * Removes expired entries, counts remaining, and decides allow/deny.
 */
@Component
public class RateLimiter {

    private static final Logger log = LoggerFactory.getLogger(RateLimiter.class);

    private final StringRedisTemplate redis;
    private final int maxPerWindow;
    private final int windowSeconds;

    public RateLimiter(StringRedisTemplate redis,
                       @Value("${notification.rate-limit.max-per-window}") int maxPerWindow,
                       @Value("${notification.rate-limit.window-seconds}") int windowSeconds) {
        this.redis = redis;
        this.maxPerWindow = maxPerWindow;
        this.windowSeconds = windowSeconds;
    }

    /**
     * Returns true if the request is allowed, false if rate-limited.
     */
    public boolean tryAcquire(String userId, String requestId) {
        String key = "rate:" + userId;
        long now = Instant.now().toEpochMilli();
        long windowStart = now - (windowSeconds * 1000L);

        // Remove expired entries
        redis.opsForZSet().removeRangeByScore(key, 0, windowStart);

        // Count current entries
        Long count = redis.opsForZSet().zCard(key);
        if (count != null && count >= maxPerWindow) {
            log.info("Rate limited user {}: {} requests in window", userId, count);
            return false;
        }

        // Add this request
        redis.opsForZSet().add(key, requestId, now);
        redis.expire(key, Duration.ofSeconds(windowSeconds + 10)); // TTL slightly beyond window

        return true;
    }

    public int getMaxPerWindow() { return maxPerWindow; }
    public int getWindowSeconds() { return windowSeconds; }
}
