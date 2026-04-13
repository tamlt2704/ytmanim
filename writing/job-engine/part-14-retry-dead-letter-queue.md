# Chapter 14: The Job That Failed 47 Times

[← Chapter 12: Who Did What, and Where's the Proof?](part-12-database-auth-audit.md) | [Series Overview](README.md)

---

## The Incident

Wednesday, 11 AM. The metrics dashboard shows something weird. Completed jobs: 12,400. Failed jobs: 12,400. Exactly the same number.

That can't be right.

> **@FiveNines:** The `send-receipt` job type has a 100% failure rate. Has been failing since 6 AM. But the submitted count keeps climbing.

You check the logs. The receipt service is down — a DNS change broke the connection. Every receipt job fails immediately with `UnknownHostException`. That part makes sense.

What doesn't make sense: the same jobs keep getting resubmitted. By users. Manually. Because the dashboard shows FAILED and they click "retry." Over and over.

> **@TicketMaster:** I have 847 support tickets from customers who didn't get their receipt. The ops team has been manually resubmitting jobs all morning. Can't the engine just... retry them?

![TicketMaster drowning in retry tickets](images/ch14-ticketmaster-retry.svg)

Then NullPointer chimes in:

> **@NullPointer:** Also, the `etl-pipeline` job has been failing for 3 days. Same error every time. It's retried 47 times. Nobody noticed because it just keeps failing silently. Can we stop retrying after a while and put it somewhere visible?

Two problems. One: transient failures need automatic retry. Two: permanent failures need to stop retrying and go somewhere an operator can see them.

You need a retry mechanism and a dead letter queue.

## The Solution Attempt — Just Resubmit on Failure

The naive approach: when a job fails, submit it again.

```java
private void executeJob(Job job) {
    try {
        job.getTask().run();
        job.transitionTo(JobStatus.RUNNING, JobStatus.COMPLETED);
    } catch (Exception e) {
        // Just resubmit — it'll work next time, right?
        submit(job);  // ← infinite retry loop
    }
}
```

## The Failing Test

```java
@Test
void permanentlyFailingJobShouldNotRetryForever() throws InterruptedException {
    AtomicInteger attempts = new AtomicInteger(0);

    // A job that ALWAYS fails — simulating a permanent error
    Runnable alwaysFails = () -> {
        attempts.incrementAndGet();
        throw new RuntimeException("Connection refused");
    };

    // Without retry limits, this job would retry forever,
    // consuming a worker thread and queue slot indefinitely.
    // After 10 seconds, we check how many times it ran.
    // With no limit, it could be hundreds or thousands.

    // What we WANT: retry 3 times, then move to dead letter queue
    // What we GET: infinite retries until the engine is shut down
}
```

Without a retry limit, a permanently failing job becomes a zombie — it consumes resources forever, never succeeds, and nobody gets alerted. The queue looks healthy (jobs are being processed), but nothing useful is happening.

```
Attempt 1: send-receipt → FAILED (DNS error)
Attempt 2: send-receipt → FAILED (DNS error)
Attempt 3: send-receipt → FAILED (DNS error)
...
Attempt 47: send-receipt → FAILED (DNS error)
Attempt 48: send-receipt → FAILED (DNS error)
... forever ...
```

## What Happened

![Infinite retry loop](images/ch14-infinite-retry.svg)

The engine has no concept of:
- **Retry count** — how many times has this job been attempted?
- **Retry delay** — should we wait before retrying? (exponential backoff)
- **Max retries** — when do we give up?
- **Dead letter queue** — where do permanently failed jobs go?

Without these, every failure is treated the same: retry immediately, retry forever. Transient errors (DNS blip, network timeout) and permanent errors (invalid input, missing resource) get the same treatment. The engine can't tell the difference.

## The Fix — Retry Policy + Dead Letter Queue

### Step 1: Add Retry Fields to the Job Model

The in-memory `Job` needs to track attempts:

```java
// Add to Job.java
private final int maxRetries;
private final long retryDelayMs;
private volatile int attemptCount = 0;

public Job(String id, String name, JobPriority priority, Duration timeout,
           Runnable task, List<String> dependsOn,
           int maxRetries, long retryDelayMs) {
    // ... existing constructor fields ...
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
}

public int getMaxRetries() { return maxRetries; }
public long getRetryDelayMs() { return retryDelayMs; }
public int getAttemptCount() { return attemptCount; }
public int incrementAttempt() { return ++attemptCount; }
public boolean hasRetriesLeft() { return attemptCount < maxRetries; }
```

`attemptCount` is `volatile` because the worker thread increments it and the monitoring thread reads it — same visibility pattern from Chapter 3.

### Step 2: The Dead Letter Queue Table

A Flyway migration adds the DLQ table:

```sql
-- src/main/resources/db/migration/V3__create_dead_letter_queue.sql

CREATE TABLE dead_letter_queue (
    id              BIGSERIAL    PRIMARY KEY,
    job_id          VARCHAR(36)  NOT NULL,
    job_name        VARCHAR(255) NOT NULL,
    priority        VARCHAR(20)  NOT NULL,
    submitted_by    BIGINT       REFERENCES app_user(id),
    failure_reason  TEXT         NOT NULL,
    attempt_count   INT          NOT NULL,
    first_failed_at TIMESTAMP    NOT NULL,
    last_failed_at  TIMESTAMP    NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'DEAD',
    resubmitted_at  TIMESTAMP,
    resubmitted_by  BIGINT       REFERENCES app_user(id),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dlq_status ON dead_letter_queue(status);
CREATE INDEX idx_dlq_job_name ON dead_letter_queue(job_name);
CREATE INDEX idx_dlq_created_at ON dead_letter_queue(created_at DESC);

-- Add retry columns to job_record
ALTER TABLE job_record ADD COLUMN max_retries INT NOT NULL DEFAULT 3;
ALTER TABLE job_record ADD COLUMN retry_delay_ms BIGINT NOT NULL DEFAULT 1000;
ALTER TABLE job_record ADD COLUMN attempt_count INT NOT NULL DEFAULT 0;
```

The DLQ is a holding pen. Jobs land here when they've exhausted all retries. An operator can inspect them, fix the root cause, and resubmit. The `status` field tracks the lifecycle:

| Status | Meaning |
|--------|---------|
| `DEAD` | Exhausted all retries. Waiting for operator. |
| `RESUBMITTED` | Operator resubmitted it. Back in the main queue. |
| `DISCARDED` | Operator reviewed it and decided to drop it. |

### Step 3: The DLQ Entity and Repository

```java
// src/main/java/com/jobengine/persistence/entity/DeadLetterEntry.java
package com.jobengine.persistence.entity;

import com.jobengine.model.JobPriority;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "dead_letter_queue")
public class DeadLetterEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private String jobId;

    @Column(name = "job_name", nullable = false)
    private String jobName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobPriority priority;

    @Column(name = "submitted_by")
    private Long submittedBy;

    @Column(name = "failure_reason", nullable = false)
    private String failureReason;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "first_failed_at", nullable = false)
    private Instant firstFailedAt;

    @Column(name = "last_failed_at", nullable = false)
    private Instant lastFailedAt;

    @Column(nullable = false, length = 20)
    private String status = "DEAD";

    @Column(name = "resubmitted_at")
    private Instant resubmittedAt;

    @Column(name = "resubmitted_by")
    private Long resubmittedBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected DeadLetterEntry() {} // JPA

    public DeadLetterEntry(String jobId, String jobName, JobPriority priority,
                           Long submittedBy, String failureReason,
                           int attemptCount, Instant firstFailedAt) {
        this.jobId = jobId;
        this.jobName = jobName;
        this.priority = priority;
        this.submittedBy = submittedBy;
        this.failureReason = failureReason;
        this.attemptCount = attemptCount;
        this.firstFailedAt = firstFailedAt;
        this.lastFailedAt = Instant.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getJobId() { return jobId; }
    public String getJobName() { return jobName; }
    public JobPriority getPriority() { return priority; }
    public Long getSubmittedBy() { return submittedBy; }
    public String getFailureReason() { return failureReason; }
    public int getAttemptCount() { return attemptCount; }
    public Instant getFirstFailedAt() { return firstFailedAt; }
    public Instant getLastFailedAt() { return lastFailedAt; }
    public String getStatus() { return status; }
    public Instant getResubmittedAt() { return resubmittedAt; }
    public Long getResubmittedBy() { return resubmittedBy; }
    public Instant getCreatedAt() { return createdAt; }

    // Only these two state changes are allowed
    public void markResubmitted(Long userId) {
        this.status = "RESUBMITTED";
        this.resubmittedAt = Instant.now();
        this.resubmittedBy = userId;
    }

    public void markDiscarded() {
        this.status = "DISCARDED";
    }
}
```
