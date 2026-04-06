# Technical Challenges: High-Throughput Calculator Service

## Goal

Build a Spring Boot backend with Java 21 that handles 10,000 requests per second for simple calculation operations, using Redis as a caching layer, with tests to verify correctness and throughput.

---

## Challenge 1: Thread Exhaustion Under High Concurrency

### The Problem

Traditional Spring Boot uses platform (OS) threads — one thread per request. Each platform thread consumes ~1MB of stack memory. At 10k concurrent requests, that's ~10GB just for thread stacks, plus the OS overhead of context-switching between them. The default Tomcat thread pool caps at 200 threads, meaning requests queue up and latency spikes.

### The Solution

```yaml
spring:
  threads:
    virtual:
      enabled: true  # Java 21 virtual threads
```

Java 21 virtual threads are lightweight (~few KB each) and managed by the JVM, not the OS. They mount/unmount from a small pool of carrier (platform) threads automatically. This means we can handle 10k+ concurrent requests without running out of memory or hitting thread pool limits. Spring Boot 3.2+ natively supports this with a single config flag.

### Why It Works

- Virtual threads are cheap to create and block — blocking on Redis I/O no longer wastes an expensive OS thread
- The JVM schedules millions of virtual threads onto a handful of carrier threads
- No code changes needed — Spring's `@Async`, `MockMvc`, and servlet stack all work transparently

---

## Challenge 2: Redundant Computation Under Repeated Requests

### The Problem

At 10k req/s, many requests will be identical (e.g., `2 + 3` computed thousands of times). Without caching, every request recomputes the same result, wasting CPU cycles. While simple arithmetic is fast, this pattern doesn't scale when operations become more complex (e.g., `POWER`, trigonometry).

### The Solution

```java
@Cacheable(value = "calculations", key = "#request.operation() + ':' + #request.a() + ':' + #request.b()")
public CalcResponse calculate(CalcRequest request) { ... }
```

Spring's `@Cacheable` annotation backed by Redis. The cache key is a composite of `operation:a:b`, so `ADD:10.0:5.0` maps to a cached `CalcResponse`. On cache hit, the method body is skipped entirely.

### Why It Works

- Redis operates in-memory with sub-millisecond latency — faster than recomputing
- The deterministic cache key ensures identical inputs always hit the same cache entry
- TTL of 30 minutes prevents stale data from living forever
- Under high throughput, cache hit ratio climbs quickly since the same calculations repeat

---

## Challenge 3: Redis Serialization Failure with Java Records

### The Problem

Spring's default Redis cache serializer uses Java's built-in `ObjectOutputStream` (JDK serialization). Java `record` types are not `Serializable` by default. When the `@Cacheable` method tried to store a `CalcResponse` record in Redis, it threw:

```
SerializationException → SerializationFailedException → IllegalArgumentException
```

### The Solution

```java
ObjectMapper cacheMapper = new ObjectMapper();
cacheMapper.activateDefaultTyping(
    BasicPolymorphicTypeValidator.builder()
        .allowIfBaseType(Object.class).build(),
    ObjectMapper.DefaultTyping.NON_FINAL,
    JsonTypeInfo.As.PROPERTY
);
GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(cacheMapper);
```

Replaced the default JDK serializer with `GenericJackson2JsonRedisSerializer`. This stores cache values as JSON with embedded type information (`@class` property), so Jackson knows to deserialize back into `CalcResponse` — not a generic `LinkedHashMap`.

### Why `GenericJackson2JsonRedisSerializer` over `Jackson2JsonRedisSerializer`

We initially tried `Jackson2JsonRedisSerializer<Object>`, but it deserializes everything as `LinkedHashMap` because it has no type information. `GenericJackson2JsonRedisSerializer` embeds `@class` metadata in the JSON, enabling proper round-trip serialization of records.

---

## Challenge 4: Redis Failure Cascading into Request Failures

### The Problem

If Redis becomes unavailable (network blip, overloaded, restarting), every `@Cacheable` call throws a `RedisCommandTimeoutException`, which propagates up as a `ServletException` — turning a cache miss into a full request failure. At 10k req/s, a Redis hiccup would take down the entire service.

### The Solution

```java
@Configuration
public class CacheErrorConfig implements CachingConfigurer {
    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException e, Cache cache, Object key) {
                log.warn("Cache get failed for key {}: {}", key, e.getMessage());
            }
            // ... same for put, evict, clear
        };
    }
}
```

A custom `CacheErrorHandler` catches all Redis errors silently. When Redis is down, the calculation still runs — it just won't be cached. The service degrades gracefully instead of failing.

### Why It Works

- Cache is an optimization, not a dependency — the calculation logic has zero Redis coupling
- Logging the warning gives observability without crashing
- When Redis recovers, caching resumes automatically with no intervention

---

## Challenge 5: Embedded Redis Instability in Tests

### The Problem

We initially used `embedded-redis` for self-contained tests. Two issues surfaced:

1. **Port binding race condition**: `System.setProperty("spring.data.redis.port", "6370")` in `@BeforeAll` runs *after* the Spring context is already initialized, so Spring connects to the default port 6379 (which isn't running) → `RedisCommandTimeoutException`

2. **Embedded Redis crashes under load**: The embedded Redis server (a native binary wrapper) can't handle 10k concurrent connections. It drops connections with `Connection reset` / `Connection refused`, causing the throughput test to fail even with the `CacheErrorHandler`.

### The Solution

**For the port race condition** — we switched to `@DynamicPropertySource`:

```java
@DynamicPropertySource
static void redisProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.data.redis.port", () -> 6370);
}
```

This injects properties *before* the Spring context starts, guaranteeing the correct port.

**For the stability issue** — we dropped embedded Redis entirely and run tests against a real Redis instance (`localhost:6379`). This is more realistic and eliminates the flakiness.

### Why It Works

- Real Redis handles 100k+ concurrent connections without breaking a sweat
- Tests reflect production behavior more accurately
- No more flaky CI failures from embedded Redis native binary quirks on different OS/architectures

---

## Challenge 6: Gradle 9.x JUnit Platform Compatibility

### The Problem

Gradle 9.x removed the automatic inclusion of `junit-platform-launcher` in the test runtime classpath. Without it:

```
Could not start Gradle Test Executor 1: Failed to load JUnit Platform
```

### The Solution

```groovy
testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
```

One line in `build.gradle`. Gradle 9 requires this to be explicit.

---

## Architecture Summary

```
Client Request
    │
    ▼
CalculatorController (REST endpoint)
    │
    ▼
CalculatorService (@Cacheable)
    │
    ├── Cache HIT  → return from Redis (sub-ms)
    │
    └── Cache MISS → compute result → store in Redis → return
    │
    ▼
CacheErrorHandler (if Redis fails → compute anyway, log warning)
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Virtual threads | Handle 10k+ concurrent requests without thread pool exhaustion |
| Redis cache with JSON serializer | Fast lookups, proper record serialization, human-readable cache entries |
| Graceful cache degradation | Redis is an optimization, not a hard dependency |
| Real Redis for tests | Stable, realistic, no embedded binary quirks |
| Semaphore-controlled throughput test | Validates 10k requests complete successfully without overwhelming test infrastructure |
