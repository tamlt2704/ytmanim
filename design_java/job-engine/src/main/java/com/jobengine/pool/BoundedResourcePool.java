package com.jobengine.pool;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * Thread-safe bounded resource pool using a blocking queue.
 *
 * Problem solved: RESOURCE EXHAUSTION + THREAD STARVATION
 * - ArrayBlockingQueue provides built-in blocking for acquire/release
 * - Bounded size prevents resource exhaustion
 * - Fair ordering (optional) prevents thread starvation
 * - No explicit locks needed — the queue handles synchronization
 *
 * Problem solved: SAFE PUBLICATION
 * - Resources are safely published through the blocking queue's
 *   happens-before guarantees (put happens-before take)
 */
public class BoundedResourcePool<T> {

    private final ArrayBlockingQueue<T> pool;
    private final int maxSize;

    public BoundedResourcePool(int maxSize, Supplier<T> factory) {
        this.maxSize = maxSize;
        this.pool = new ArrayBlockingQueue<>(maxSize, true); // fair=true prevents starvation
        for (int i = 0; i < maxSize; i++) {
            pool.offer(factory.get());
        }
    }

    /**
     * Acquire a resource, blocking up to the specified timeout.
     * Returns null if timeout expires.
     */
    public T acquire(long timeoutMs) throws InterruptedException {
        return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);
    }

    /**
     * Release a resource back to the pool.
     */
    public void release(T resource) {
        if (resource != null) {
            pool.offer(resource);
        }
    }

    public int available() { return pool.size(); }
    public int getMaxSize() { return maxSize; }
}
