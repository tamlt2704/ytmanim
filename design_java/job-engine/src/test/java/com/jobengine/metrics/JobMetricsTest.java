package com.jobengine.metrics;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThat;

class JobMetricsTest {

    @Test
    void shouldTrackBasicMetrics() {
        JobMetrics metrics = new JobMetrics();

        metrics.recordSubmitted();
        metrics.recordSubmitted();
        metrics.recordCompleted(100);
        metrics.recordFailed();

        assertThat(metrics.getSubmitted()).isEqualTo(2);
        assertThat(metrics.getCompleted()).isEqualTo(1);
        assertThat(metrics.getFailed()).isEqualTo(1);
        assertThat(metrics.getAverageProcessingTimeMs()).isEqualTo(100.0);
    }

    @Test
    void shouldTrackActiveJobs() {
        JobMetrics metrics = new JobMetrics();

        metrics.incrementActive();
        metrics.incrementActive();
        assertThat(metrics.getActiveJobs()).isEqualTo(2);

        metrics.decrementActive();
        assertThat(metrics.getActiveJobs()).isEqualTo(1);
    }

    /**
     * Verifies LongAdder handles concurrent increments without lost updates.
     * This is the exact problem AtomicLong solves, but LongAdder does it faster
     * under high contention by striping across CPU cores.
     */
    @Test
    void shouldHandleConcurrentIncrements() throws InterruptedException {
        JobMetrics metrics = new JobMetrics();
        int threads = 100;
        int incrementsPerThread = 1000;
        CountDownLatch latch = new CountDownLatch(threads);

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < threads; i++) {
                executor.submit(() -> {
                    for (int j = 0; j < incrementsPerThread; j++) {
                        metrics.recordSubmitted();
                    }
                    latch.countDown();
                });
            }
            latch.await();
        }

        // No lost updates — all 100,000 increments counted
        assertThat(metrics.getSubmitted()).isEqualTo((long) threads * incrementsPerThread);
    }

    @Test
    void shouldReset() {
        JobMetrics metrics = new JobMetrics();
        metrics.recordSubmitted();
        metrics.recordCompleted(50);
        metrics.incrementActive();

        metrics.reset();

        assertThat(metrics.getSubmitted()).isZero();
        assertThat(metrics.getCompleted()).isZero();
        assertThat(metrics.getActiveJobs()).isZero();
    }
}
