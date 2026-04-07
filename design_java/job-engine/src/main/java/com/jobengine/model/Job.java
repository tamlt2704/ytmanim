package com.jobengine.model;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Thread-safe job representation.
 *
 * Problem solved: VISIBILITY + ATOMICITY
 * - Status uses AtomicReference for lock-free CAS transitions
 * - Immutable fields (id, priority, timeout) need no synchronization
 * - Mutable fields (status, timestamps) use atomic operations
 */
public class Job implements Comparable<Job> {

    private final String id;
    private final String name;
    private final JobPriority priority;
    private final Duration timeout;
    private final Runnable task;
    private final List<String> dependsOn; // job IDs this depends on

    // Thread-safe mutable state
    private final AtomicReference<JobStatus> status = new AtomicReference<>(JobStatus.PENDING);
    private volatile Instant submittedAt;
    private volatile Instant startedAt;
    private volatile Instant completedAt;
    private volatile String failureReason;

    public Job(String id, String name, JobPriority priority, Duration timeout,
               Runnable task, List<String> dependsOn) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.timeout = timeout;
        this.task = task;
        this.dependsOn = dependsOn != null ? List.copyOf(dependsOn) : List.of();
        this.submittedAt = Instant.now();
    }

    // --- Atomic status transitions (CAS prevents lost updates) ---

    public boolean transitionTo(JobStatus expected, JobStatus next) {
        return status.compareAndSet(expected, next);
    }

    public boolean cancel() {
        // Can only cancel PENDING jobs
        return status.compareAndSet(JobStatus.PENDING, JobStatus.CANCELLED);
    }

    // --- Getters ---

    public String getId() { return id; }
    public String getName() { return name; }
    public JobPriority getPriority() { return priority; }
    public Duration getTimeout() { return timeout; }
    public Runnable getTask() { return task; }
    public List<String> getDependsOn() { return dependsOn; }
    public JobStatus getStatus() { return status.get(); }
    public Instant getSubmittedAt() { return submittedAt; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public String getFailureReason() { return failureReason; }

    public void setStartedAt(Instant t) { this.startedAt = t; }
    public void setCompletedAt(Instant t) { this.completedAt = t; }
    public void setFailureReason(String r) { this.failureReason = r; }

    /**
     * Priority ordering for PriorityBlockingQueue.
     * Higher priority = dequeued first (reversed compareTo).
     */
    @Override
    public int compareTo(Job other) {
        int cmp = Integer.compare(other.priority.getWeight(), this.priority.getWeight());
        if (cmp != 0) return cmp;
        return this.submittedAt.compareTo(other.submittedAt); // FIFO within same priority
    }
}
