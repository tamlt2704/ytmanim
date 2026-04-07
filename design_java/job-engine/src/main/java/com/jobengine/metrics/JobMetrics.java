package com.jobengine.metrics;

import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;

/**
 * Thread-safe metrics using lock-free counters.
 *
 * Problem solved: RACE CONDITIONS ON SHARED COUNTERS
 * - AtomicLong for values that need exact reads (active jobs)
 * - LongAdder for high-contention write-heavy counters (submitted, completed)
 *   LongAdder stripes across CPU cores to reduce CAS contention
 */
public class JobMetrics {

    private final LongAdder submitted = new LongAdder();
    private final LongAdder completed = new LongAdder();
    private final LongAdder failed = new LongAdder();
    private final LongAdder cancelled = new LongAdder();
    private final LongAdder timedOut = new LongAdder();
    private final AtomicLong activeJobs = new AtomicLong(0);
    private final LongAdder totalProcessingTimeMs = new LongAdder();

    public void recordSubmitted() { submitted.increment(); }
    public void recordCompleted(long processingTimeMs) {
        completed.increment();
        totalProcessingTimeMs.add(processingTimeMs);
    }
    public void recordFailed() { failed.increment(); }
    public void recordCancelled() { cancelled.increment(); }
    public void recordTimedOut() { timedOut.increment(); }

    public void incrementActive() { activeJobs.incrementAndGet(); }
    public void decrementActive() { activeJobs.decrementAndGet(); }

    public long getSubmitted() { return submitted.sum(); }
    public long getCompleted() { return completed.sum(); }
    public long getFailed() { return failed.sum(); }
    public long getCancelled() { return cancelled.sum(); }
    public long getTimedOut() { return timedOut.sum(); }
    public long getActiveJobs() { return activeJobs.get(); }

    public double getAverageProcessingTimeMs() {
        long count = completed.sum();
        return count == 0 ? 0 : (double) totalProcessingTimeMs.sum() / count;
    }

    public void reset() {
        submitted.reset();
        completed.reset();
        failed.reset();
        cancelled.reset();
        timedOut.reset();
        activeJobs.set(0);
        totalProcessingTimeMs.reset();
    }
}
