package com.jobengine.pool;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class BoundedResourcePoolTest {

    @Test
    void shouldAcquireAndRelease() throws InterruptedException {
        BoundedResourcePool<String> pool = new BoundedResourcePool<>(3, () -> "resource");

        assertThat(pool.available()).isEqualTo(3);

        String r1 = pool.acquire(100);
        assertThat(r1).isEqualTo("resource");
        assertThat(pool.available()).isEqualTo(2);

        pool.release(r1);
        assertThat(pool.available()).isEqualTo(3);
    }

    @Test
    void shouldBlockWhenExhausted() throws InterruptedException {
        BoundedResourcePool<String> pool = new BoundedResourcePool<>(1, () -> "r");

        String r1 = pool.acquire(100);
        assertThat(r1).isNotNull();

        // Pool is empty — should timeout
        String r2 = pool.acquire(50);
        assertThat(r2).isNull();

        pool.release(r1);

        // Now available again
        String r3 = pool.acquire(100);
        assertThat(r3).isNotNull();
    }

    /**
     * Verifies no resource leaks under concurrent access.
     * All resources acquired must be released — pool returns to full capacity.
     */
    @Test
    void shouldHandleConcurrentAccessWithoutLeaks() throws InterruptedException {
        int poolSize = 5;
        BoundedResourcePool<Integer> pool = new BoundedResourcePool<>(poolSize, () -> 1);
        int threads = 50;
        int opsPerThread = 100;
        CountDownLatch latch = new CountDownLatch(threads);
        AtomicInteger successCount = new AtomicInteger(0);

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < threads; i++) {
                executor.submit(() -> {
                    try {
                        for (int j = 0; j < opsPerThread; j++) {
                            Integer resource = pool.acquire(1000);
                            if (resource != null) {
                                successCount.incrementAndGet();
                                Thread.sleep(1); // simulate work
                                pool.release(resource);
                            }
                        }
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    } finally {
                        latch.countDown();
                    }
                });
            }
            latch.await();
        }

        // All resources returned — no leaks
        assertThat(pool.available()).isEqualTo(poolSize);
        assertThat(successCount.get()).isEqualTo(threads * opsPerThread);
    }
}
