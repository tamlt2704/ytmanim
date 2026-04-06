package com.notify.circuitbreaker;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CircuitBreakerTest {

    @Test
    void shouldStartClosed() {
        CircuitBreaker cb = new CircuitBreaker("test", 3, 1000);
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.CLOSED);
        assertThat(cb.isCallPermitted()).isTrue();
    }

    @Test
    void shouldOpenAfterThresholdFailures() {
        CircuitBreaker cb = new CircuitBreaker("test", 3, 1000);

        cb.recordFailure();
        cb.recordFailure();
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.CLOSED);

        cb.recordFailure(); // 3rd failure = threshold
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.OPEN);
        assertThat(cb.isCallPermitted()).isFalse();
    }

    @Test
    void shouldResetOnSuccess() {
        CircuitBreaker cb = new CircuitBreaker("test", 3, 1000);

        cb.recordFailure();
        cb.recordFailure();
        cb.recordSuccess(); // reset

        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.CLOSED);
        assertThat(cb.isCallPermitted()).isTrue();
    }

    @Test
    void shouldTransitionToHalfOpenAfterTimeout() throws InterruptedException {
        CircuitBreaker cb = new CircuitBreaker("test", 2, 100); // 100ms timeout

        cb.recordFailure();
        cb.recordFailure(); // opens
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.OPEN);

        Thread.sleep(150); // wait past timeout

        assertThat(cb.isCallPermitted()).isTrue(); // transitions to HALF_OPEN
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.HALF_OPEN);
    }

    @Test
    void shouldCloseFromHalfOpenOnSuccess() throws InterruptedException {
        CircuitBreaker cb = new CircuitBreaker("test", 2, 100);

        cb.recordFailure();
        cb.recordFailure();
        Thread.sleep(150);
        cb.isCallPermitted(); // HALF_OPEN

        cb.recordSuccess();
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.CLOSED);
    }

    @Test
    void shouldReopenFromHalfOpenOnFailure() throws InterruptedException {
        CircuitBreaker cb = new CircuitBreaker("test", 2, 100);

        cb.recordFailure();
        cb.recordFailure();
        Thread.sleep(150);
        cb.isCallPermitted(); // HALF_OPEN

        cb.recordFailure();
        assertThat(cb.getState()).isEqualTo(CircuitBreaker.State.OPEN);
    }

    @Test
    void registryShouldReturnSameInstanceForSameName() {
        CircuitBreaker.Registry registry = new CircuitBreaker.Registry(5, 30000);
        CircuitBreaker cb1 = registry.get("EMAIL");
        CircuitBreaker cb2 = registry.get("EMAIL");
        CircuitBreaker cb3 = registry.get("SMS");

        assertThat(cb1).isSameAs(cb2);
        assertThat(cb1).isNotSameAs(cb3);
    }
}
