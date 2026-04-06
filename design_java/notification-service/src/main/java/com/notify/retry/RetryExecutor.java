package com.notify.retry;

import com.notify.channel.NotificationChannel.ChannelException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Retry with exponential backoff. Decorates any channel send operation.
 */
public class RetryExecutor {

    private static final Logger log = LoggerFactory.getLogger(RetryExecutor.class);

    private final int maxAttempts;
    private final long initialDelayMs;

    public RetryExecutor(int maxAttempts, long initialDelayMs) {
        this.maxAttempts = maxAttempts;
        this.initialDelayMs = initialDelayMs;
    }

    @FunctionalInterface
    public interface SendAction {
        void execute() throws ChannelException;
    }

    /**
     * Executes the action with retry. Returns the attempt count.
     * Throws ChannelException if all attempts fail.
     */
    public int executeWithRetry(SendAction action) throws ChannelException {
        ChannelException lastException = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                action.execute();
                return attempt;
            } catch (ChannelException e) {
                lastException = e;
                log.warn("Attempt {}/{} failed: {}", attempt, maxAttempts, e.getMessage());

                if (attempt < maxAttempts) {
                    long delay = initialDelayMs * (1L << (attempt - 1)); // exponential backoff
                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new ChannelException("Retry interrupted", ie);
                    }
                }
            }
        }
        throw lastException;
    }

    public int getMaxAttempts() { return maxAttempts; }
}
