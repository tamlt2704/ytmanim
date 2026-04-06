package com.notify.circuitbreaker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Per-channel circuit breaker. States: CLOSED (normal), OPEN (failing), HALF_OPEN (testing).
 * After failureThreshold consecutive failures, opens the circuit for resetTimeoutMs.
 * Then allows one probe request (HALF_OPEN). If it succeeds, closes. If it fails, reopens.
 */
public class CircuitBreaker {

    private static final Logger log = LoggerFactory.getLogger(CircuitBreaker.class);

    public enum State { CLOSED, OPEN, HALF_OPEN }

    private final String name;
    private final int failureThreshold;
    private final long resetTimeoutMs;

    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicReference<State> state = new AtomicReference<>(State.CLOSED);
    private volatile Instant lastFailureTime = Instant.MIN;

    public CircuitBreaker(String name, int failureThreshold, long resetTimeoutMs) {
        this.name = name;
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }

    public boolean isCallPermitted() {
        return switch (state.get()) {
            case CLOSED -> true;
            case OPEN -> {
                if (Instant.now().toEpochMilli() - lastFailureTime.toEpochMilli() > resetTimeoutMs) {
                    state.set(State.HALF_OPEN);
                    log.info("Circuit {} transitioning to HALF_OPEN", name);
                    yield true;
                }
                yield false;
            }
            case HALF_OPEN -> true; // allow one probe
        };
    }

    public void recordSuccess() {
        if (state.get() == State.HALF_OPEN) {
            log.info("Circuit {} closing after successful probe", name);
        }
        failureCount.set(0);
        state.set(State.CLOSED);
    }

    public void recordFailure() {
        lastFailureTime = Instant.now();
        int failures = failureCount.incrementAndGet();
        if (state.get() == State.HALF_OPEN || failures >= failureThreshold) {
            state.set(State.OPEN);
            log.warn("Circuit {} OPEN after {} failures", name, failures);
        }
    }

    public State getState() { return state.get(); }
    public String getName() { return name; }

    // Factory for managing per-channel breakers
    public static class Registry {
        private final ConcurrentHashMap<String, CircuitBreaker> breakers = new ConcurrentHashMap<>();
        private final int failureThreshold;
        private final long resetTimeoutMs;

        public Registry(int failureThreshold, long resetTimeoutMs) {
            this.failureThreshold = failureThreshold;
            this.resetTimeoutMs = resetTimeoutMs;
        }

        public CircuitBreaker get(String name) {
            return breakers.computeIfAbsent(name,
                    n -> new CircuitBreaker(n, failureThreshold, resetTimeoutMs));
        }
    }
}
