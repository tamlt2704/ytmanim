package com.notify.retry;

import com.notify.channel.NotificationChannel.ChannelException;
import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.*;

class RetryExecutorTest {

    @Test
    void shouldSucceedOnFirstAttempt() {
        RetryExecutor executor = new RetryExecutor(3, 10);
        AtomicInteger calls = new AtomicInteger(0);

        int attempts = executor.executeWithRetry(calls::incrementAndGet);

        assertThat(attempts).isEqualTo(1);
        assertThat(calls.get()).isEqualTo(1);
    }

    @Test
    void shouldRetryAndSucceed() {
        RetryExecutor executor = new RetryExecutor(3, 10);
        AtomicInteger calls = new AtomicInteger(0);

        int attempts = executor.executeWithRetry(() -> {
            if (calls.incrementAndGet() < 3) {
                throw new ChannelException("Transient failure");
            }
        });

        assertThat(attempts).isEqualTo(3);
        assertThat(calls.get()).isEqualTo(3);
    }

    @Test
    void shouldThrowAfterMaxAttempts() {
        RetryExecutor executor = new RetryExecutor(3, 10);
        AtomicInteger calls = new AtomicInteger(0);

        assertThatThrownBy(() -> executor.executeWithRetry(() -> {
            calls.incrementAndGet();
            throw new ChannelException("Permanent failure");
        })).isInstanceOf(ChannelException.class)
                .hasMessage("Permanent failure");

        assertThat(calls.get()).isEqualTo(3);
    }

    @Test
    void shouldApplyExponentialBackoff() {
        RetryExecutor executor = new RetryExecutor(3, 50);
        long start = System.currentTimeMillis();

        assertThatThrownBy(() -> executor.executeWithRetry(() -> {
            throw new ChannelException("fail");
        }));

        long elapsed = System.currentTimeMillis() - start;
        // 50ms + 100ms = 150ms minimum (backoff between attempts 1→2 and 2→3)
        assertThat(elapsed).isGreaterThanOrEqualTo(140);
    }
}
