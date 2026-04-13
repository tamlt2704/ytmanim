# Chapter 13: 47 Jobs in 3 Seconds

[← Chapter 12: Who Did What, and Where's the Proof?](part-12-database-auth-audit.md) | [Chapter 14: The Deploy That Killed 47 Jobs →](part-14-graceful-shutdown.md)

---

## The Incident

Tuesday morning. The `deploy-bot` incident from Chapter 12 is closed — ZeroTrust disabled the service account, Bobby Tables found the audit trail. But TicketMaster isn't done.

> **@TicketMaster:** Before we disabled it, `deploy-bot` submitted 47 jobs in 3 seconds. Forty-seven. The engine accepted every single one. What if a real user's token gets stolen? An attacker could flood the queue in seconds.

She's right. The engine has backpressure (Chapter 8) — it rejects jobs when the queue is full. But the queue holds 10,000 jobs. An attacker with a valid token can submit 10,000 jobs before backpressure kicks in. That's not protection. That's a very large buffer before the explosion.

> **@ZeroTrust:** Rate limiting. Per user. Per endpoint. If someone submits more than 20 jobs per minute, they get 429. No exceptions.

![deploy-bot floods the queue](images/ch13-rate-limit.svg)

You need to throttle requests before they reach the engine. Not after.

## The Solution Attempt — No Rate Limiting

Right now, the only protection is backpressure at the queue level:

```java
// In JobEngine.submit()
if (queue.size() >= maxQueueSize) {
    return false;  // reject — but only when 10,000 jobs are already queued
}
```

This is a circuit breaker for the engine, not a rate limiter for users. A single user can consume the entire queue capacity, starving everyone else.

```
User A: ████████████████████████████████████████ 10,000 jobs
User B: (waiting...)
User C: (waiting...)
Queue:  [FULL] → 429 for everyone
```

## The Failing Test

```java
@Test
void singleUserShouldNotFloodTheQueue() throws Exception {
    String token = login("operator", "operator123");

    // Submit 50 jobs in rapid succession — no rate limit
    int accepted = 0;
    for (int i = 0; i < 50; i++) {
        var result = mockMvc.perform(post("/api/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .content("""
                    {"name": "flood-%d", "priority": "LOW", "timeoutMs": 5000}
                    """.formatted(i)))
                .andReturn();

        if (result.getResponse().getStatus() == 200) {
            accepted++;
        }
    }

    // Without rate limiting, ALL 50 are accepted
    assertThat(accepted).isEqualTo(50);

    // We WANT: only 20 accepted per minute, rest get 429
}
```

All 50 accepted. No throttling. A stolen token is a firehose.

## What Happened

The API has authentication (Chapter 12) but no authorization limits on volume. Knowing *who* is making requests doesn't help if you don't limit *how many*. Authentication answers "who are you?" Rate limiting answers "how much can you do?"

```
Authentication:  ✅ "You are operator"
Authorization:   ✅ "Operators can submit jobs"
Rate limiting:   ❌ "How many? As many as you want!"
```

## The Fix — Token Bucket Rate Limiter

The token bucket algorithm is simple: each user has a bucket that holds N tokens. Each request consumes one token. Tokens refill at a fixed rate. When the bucket is empty, requests are rejected with 429.

```
Bucket capacity: 20 tokens
Refill rate: 20 tokens per minute (1 every 3 seconds)

Request 1:  [████████████████████] 19 tokens left → 200 OK
Request 2:  [███████████████████ ] 18 tokens left → 200 OK
...
Request 20: [                    ]  0 tokens left → 200 OK
Request 21: [                    ]  0 tokens left → 429 Too Many Requests
(3 seconds later: 1 token refills)
Request 22: [█                   ]  0 tokens left → 200 OK
```

### The Rate Limiter — Pure Java, No External Dependencies

```java
// src/main/java/com/jobengine/ratelimit/TokenBucketRateLimiter.java
package com.jobengine.ratelimit;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Thread-safe token bucket rate limiter.
 *
 * Each key (user, IP, API key) gets its own bucket.
 * Buckets are created lazily on first request.
 *
 * Uses CAS (Chapter 2) for lock-free token consumption.
 */
public class TokenBucketRateLimiter {

    private final int maxTokens;
    private final double refillRatePerSecond;
    private final ConcurrentHashMap<String, AtomicReference<Bucket>> buckets
            = new ConcurrentHashMap<>();

    public TokenBucketRateLimiter(int maxTokens, double refillRatePerSecond) {
        this.maxTokens = maxTokens;
        this.refillRatePerSecond = refillRatePerSecond;
    }

    /**
     * Try to consume one token for the given key.
     * Returns true if allowed, false if rate limited.
     */
    public boolean tryConsume(String key) {
        AtomicReference<Bucket> ref = buckets.computeIfAbsent(key,
                k -> new AtomicReference<>(new Bucket(maxTokens, System.nanoTime())));

        // CAS loop — same pattern as Job.transitionTo() from Chapter 2
        while (true) {
            Bucket current = ref.get();
            Bucket refilled = current.refill(maxTokens, refillRatePerSecond);

            if (refilled.tokens < 1.0) {
                return false;  // bucket empty — rate limited
            }

            Bucket consumed = new Bucket(refilled.tokens - 1.0, refilled.lastRefillNanos);
            if (ref.compareAndSet(current, consumed)) {
                return true;  // CAS succeeded — token consumed
            }
            // CAS failed — another thread modified the bucket, retry
        }
    }

    /**
     * Get remaining tokens for a key (for response headers).
     */
    public int remaining(String key) {
        AtomicReference<Bucket> ref = buckets.get(key);
        if (ref == null) return maxTokens;
        Bucket refilled = ref.get().refill(maxTokens, refillRatePerSecond);
        return (int) refilled.tokens;
    }

    /**
     * Immutable bucket state. New instance on every mutation.
     * This makes CAS safe — no shared mutable state.
     */
    private record Bucket(double tokens, long lastRefillNanos) {

        Bucket refill(int maxTokens, double refillRatePerSecond) {
            long now = System.nanoTime();
            double elapsed = (now - lastRefillNanos) / 1_000_000_000.0;
            double newTokens = Math.min(maxTokens, tokens + elapsed * refillRatePerSecond);
            return new Bucket(newTokens, now);
        }
    }
}
```

Notice the pattern: `ConcurrentHashMap` for the bucket registry (same as `DependencyResolver` in Chapter 7), `AtomicReference` with CAS for lock-free updates (same as `Job.transitionTo()` in Chapter 2), and an immutable record for the bucket state. Every concurrency primitive you learned in Parts 2-9 shows up here.

### Why Not `synchronized`?

Same reason as Chapter 2. Under high contention (hundreds of concurrent requests), CAS scales better than locks. The bucket is tiny — two fields — so the CAS retry loop almost never loops more than once.

### Wire It Into Spring — A Filter

The rate limiter runs as a servlet filter, before the request reaches the controller. If the bucket is empty, the filter short-circuits with 429 and the controller never sees the request.

```java
// src/main/java/com/jobengine/ratelimit/RateLimitFilter.java
package com.jobengine.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // 20 requests per minute = 0.333 tokens/second
    private final TokenBucketRateLimiter limiter =
            new TokenBucketRateLimiter(20, 20.0 / 60.0);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip rate limiting for health checks and login
        String path = request.getRequestURI();
        if (path.startsWith("/actuator") || path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Rate limit by authenticated username, fall back to IP
        String key = resolveKey(request);

        if (!limiter.tryConsume(key)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("""
                {"error": "Rate limit exceeded", "retryAfterSeconds": 3}
                """);

            // Add standard rate limit headers
            response.setHeader("Retry-After", "3");
            response.setIntHeader("X-RateLimit-Limit", 20);
            response.setIntHeader("X-RateLimit-Remaining", 0);
            return;
        }

        // Add rate limit headers to successful responses too
        response.setIntHeader("X-RateLimit-Limit", 20);
        response.setIntHeader("X-RateLimit-Remaining", limiter.remaining(key));

        filterChain.doFilter(request, response);
    }

    private String resolveKey(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal())) {
            return "user:" + auth.getName();
        }
        return "ip:" + request.getRemoteAddr();
    }
}
```

### Register the Filter After JWT Auth

The rate limit filter must run after `JwtAuthFilter` — otherwise you don't know who the user is and can't rate limit per user.

```java
// In SecurityConfig.java — add the rate limit filter
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterAfter(rateLimitFilter, JwtAuthFilter.class)  // ← after JWT
        .authorizeHttpRequests(auth -> auth
            // ... same as Chapter 12
        );
    return http.build();
}
```

## The Test That Proves the Fix

### Unit Test — The Token Bucket

```java
// src/test/java/com/jobengine/ratelimit/TokenBucketRateLimiterTest.java
package com.jobengine.ratelimit;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class TokenBucketRateLimiterTest {

    @Test
    void shouldAllowUpToMaxTokens() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 1.0);

        for (int i = 0; i < 5; i++) {
            assertThat(limiter.tryConsume("user-1")).isTrue();
        }

        // 6th request — bucket empty
        assertThat(limiter.tryConsume("user-1")).isFalse();
    }

    @Test
    void shouldRefillOverTime() throws InterruptedException {
        // 10 tokens, refill 10 per second = 1 token every 100ms
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(10, 10.0);

        // Drain all tokens
        for (int i = 0; i < 10; i++) {
            limiter.tryConsume("user-1");
        }
        assertThat(limiter.tryConsume("user-1")).isFalse();

        // Wait 200ms — should refill ~2 tokens
        Thread.sleep(200);
        assertThat(limiter.tryConsume("user-1")).isTrue();
    }

    @Test
    void shouldIsolateUserBuckets() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(3, 1.0);

        // Drain user-1's bucket
        for (int i = 0; i < 3; i++) {
            limiter.tryConsume("user-1");
        }
        assertThat(limiter.tryConsume("user-1")).isFalse();

        // user-2 is unaffected
        assertThat(limiter.tryConsume("user-2")).isTrue();
    }

    @Test
    void shouldHandleConcurrentAccess() throws InterruptedException {
        // 100 tokens, no refill (rate=0 to make test deterministic)
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(100, 0);

        int threads = 50;
        int requestsPerThread = 10; // 500 total, but only 100 tokens
        CountDownLatch latch = new CountDownLatch(threads);
        AtomicInteger accepted = new AtomicInteger(0);
        AtomicInteger rejected = new AtomicInteger(0);

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < threads; i++) {
                executor.submit(() -> {
                    for (int j = 0; j < requestsPerThread; j++) {
                        if (limiter.tryConsume("shared-key")) {
                            accepted.incrementAndGet();
                        } else {
                            rejected.incrementAndGet();
                        }
                    }
                    latch.countDown();
                });
            }
            latch.await();
        }

        // Exactly 100 accepted (CAS guarantees no over-consumption)
        assertThat(accepted.get()).isEqualTo(100);
        assertThat(rejected.get()).isEqualTo(400);
        assertThat(accepted.get() + rejected.get()).isEqualTo(500);
    }
}
```

50 threads, 500 requests, 100 tokens. CAS guarantees exactly 100 are accepted. No over-consumption. No lost tokens. Same guarantee as `Job.transitionTo()` from Chapter 2.

### Integration Test — The HTTP Layer

```java
// src/test/java/com/jobengine/ratelimit/RateLimitIntegrationTest.java
package com.jobengine.ratelimit;

import com.jobengine.IntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
class RateLimitIntegrationTest extends IntegrationTestBase {

    @Autowired private MockMvc mockMvc;

    @Test
    void shouldReturn429WhenRateLimitExceeded() throws Exception {
        String token = login("operator", "operator123");

        int accepted = 0;
        int rateLimited = 0;

        for (int i = 0; i < 25; i++) {
            var result = mockMvc.perform(post("/api/jobs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content("""
                        {"name": "rate-test-%d", "priority": "LOW", "timeoutMs": 5000}
                        """.formatted(i)))
                    .andReturn();

            if (result.getResponse().getStatus() == 200) {
                accepted++;
            } else if (result.getResponse().getStatus() == 429) {
                rateLimited++;
            }
        }

        // First 20 accepted, remaining 5 rate limited
        assertThat(accepted).isEqualTo(20);
        assertThat(rateLimited).isEqualTo(5);
    }

    @Test
    void shouldIncludeRateLimitHeaders() throws Exception {
        String token = login("operator", "operator123");

        mockMvc.perform(get("/api/jobs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-RateLimit-Limit"))
                .andExpect(header().exists("X-RateLimit-Remaining"));
    }

    @Test
    void shouldNotRateLimitHealthCheck() throws Exception {
        for (int i = 0; i < 30; i++) {
            mockMvc.perform(get("/actuator/health"))
                    .andExpect(status().isOk());
        }
        // All 30 pass — health checks are exempt
    }

    private String login(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format(
                                """
                                {"username": "%s", "password": "%s"}
                                """, username, password)))
                .andExpect(status().isOk())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        return body.split("\"token\":\"")[1].split("\"")[0];
    }
}
```

## The Response Headers

Every response now includes rate limit information. Clients can adapt before hitting the wall.

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 14
```

When the limit is hit:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 3
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0

{"error": "Rate limit exceeded", "retryAfterSeconds": 3}
```

The `Retry-After` header tells well-behaved clients exactly when to try again. The dashboard can show a countdown. The load balancer can back off.

## Why Not Use a Library?

You could use Bucket4j, Resilience4j, or a Redis-based rate limiter. For a single instance, the in-memory token bucket is simpler, faster, and has zero dependencies. For multiple instances (Chapter 15 territory), you'd move the bucket state to Redis so all pods share the same counters.

## What We Added

| Component | What It Does |
|-----------|-------------|
| `TokenBucketRateLimiter` | Lock-free per-user rate limiting with CAS |
| `RateLimitFilter` | Servlet filter that intercepts requests before controllers |
| `X-RateLimit-*` headers | Clients know their remaining quota |
| `Retry-After` header | Clients know when to retry |

> **@ZeroTrust:** 20 requests per minute per user. If a token gets stolen, the attacker can submit 20 jobs before we notice and revoke. That's manageable. 10,000 was not.

> **@TicketMaster:** Can we make it configurable per role? Admins get 100, operators get 20, viewers get 50?

> **@Linus:** File a ticket.

> **@TicketMaster:** Already did.

But the next morning, FiveNines runs a deploy and something terrible happens...

---

[← Chapter 12: Who Did What, and Where's the Proof?](part-12-database-auth-audit.md) | [Chapter 14: The Deploy That Killed 47 Jobs →](part-14-graceful-shutdown.md)
