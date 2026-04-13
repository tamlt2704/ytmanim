# Chapter 14: The Deploy That Killed 47 Jobs

[← Chapter 13: 47 Jobs in 3 Seconds](part-13-rate-limiting.md) | [Series Overview](README.md)

---

## The Incident

Wednesday, 2:15 PM. FiveNines deploys a config change. Nothing dramatic — a log level tweak. The CI/CD pipeline from Chapter 11 kicks in. Tests pass. New container image builds. Kubernetes rolls out the new pod.

The old pod gets a `SIGTERM`. It dies immediately. The new pod starts up.

> **@FiveNines:** 47 jobs just vanished. They were RUNNING when the pod restarted. The startup recovery from Chapter 12 marked them all as FAILED with "pod restarted." But they were halfway done. One of them was a 30-minute report generation for the CFO.

> **@TicketMaster:** The CFO's report. The one due at 2:30. That report?

> **@FiveNines:** That report.

![47 jobs killed by a deploy](images/ch14-graceful-shutdown.svg)

The engine shuts down instantly. `shutdownNow()` interrupts every worker. In-flight jobs get `InterruptedException`, their status never transitions to COMPLETED, and the startup recovery marks them FAILED. A routine deploy just killed 47 jobs.

## The Solution Attempt — `shutdownNow()`

Here's what the engine does today when the JVM shuts down:

```java
public void shutdownNow() {
    running = false;
    workerPool.shutdownNow();       // interrupt all workers immediately
    timeoutScheduler.shutdownNow(); // kill the timeout scheduler
}
```

`shutdownNow()` sends `InterruptedException` to every thread. Workers that are mid-execution get interrupted. The task's `Runnable` throws, the job transitions to... nothing. The CAS from RUNNING to COMPLETED never fires. The pod dies. The database still says RUNNING. The recovery service marks it FAILED on the next startup.

```
SIGTERM received
    │
    ▼
shutdownNow()
    ├── Worker-1: running CFO report → InterruptedException → DEAD
    ├── Worker-2: running payment job → InterruptedException → DEAD
    ├── Worker-3: running email job → InterruptedException → DEAD
    └── Worker-4: idle → stopped
    │
    ▼
Pod dies. 47 jobs orphaned.
```

## The Failing Test

```java
@Test
void inFlightJobsShouldNotBeKilledOnShutdown() throws InterruptedException {
    JobEngine engine = new JobEngine(4, 1000);
    CountDownLatch jobStarted = new CountDownLatch(1);
    AtomicBoolean jobCompleted = new AtomicBoolean(false);

    Job longJob = new Job("1", "cfo-report", JobPriority.CRITICAL,
            Duration.ofMinutes(5),
            () -> {
                jobStarted.countDown();
                try {
                    Thread.sleep(2000); // simulate 2 seconds of work
                    jobCompleted.set(true);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    // Job was killed mid-execution!
                }
            }, null);

    engine.submit(longJob);
    jobStarted.await(); // wait until the job is actually running

    // Simulate a deploy — shut down the engine
    engine.shutdownNow();
    engine.awaitTermination(1, TimeUnit.SECONDS);

    // FAILS — job was interrupted, never completed
    assertThat(jobCompleted.get()).isTrue();
}
```

```
expected: true
 but was: false
```

The job was running. The shutdown killed it. The CFO didn't get the report.

## What Happened

`shutdownNow()` is the nuclear option. It's designed for emergencies — OOM, deadlock, unrecoverable state. For a routine deploy, you want the opposite: let in-flight jobs finish, stop accepting new ones, and shut down only when the queue is drained.

This is the difference between a hard shutdown and a graceful shutdown:

```
Hard shutdown (shutdownNow):
  SIGTERM → kill everything → pod dies → orphaned jobs

Graceful shutdown:
  SIGTERM → stop accepting new jobs
         → wait for in-flight jobs to finish
         → health check returns 503 (load balancer stops sending traffic)
         → all jobs done → pod dies cleanly
```

## The Fix — Graceful Shutdown with Drain Period

Three changes:

1. A `shutdown()` method that stops accepting new jobs but lets workers finish
2. A JVM shutdown hook that triggers graceful shutdown on `SIGTERM`
3. A health check that returns 503 during the drain period so the load balancer stops sending traffic

### The Graceful Shutdown Logic

```java
// Add to JobEngine.java

private volatile boolean draining = false;
private final CountDownLatch drainComplete = new CountDownLatch(1);

/**
 * Graceful shutdown:
 * 1. Stop accepting new jobs
 * 2. Let in-flight jobs finish (up to the drain timeout)
 * 3. Force-kill anything still running after the timeout
 */
public void gracefulShutdown(Duration drainTimeout) {
    if (draining) return;  // already shutting down
    draining = true;
    running = false;  // workers stop polling for new jobs after current iteration

    log.info("Graceful shutdown initiated. Drain timeout: {}", drainTimeout);
    log.info("In-flight jobs: {}", inFlightJobs.size());

    try {
        // Wait for workers to finish current jobs
        workerPool.shutdown();  // no new tasks, but existing ones continue
        boolean drained = workerPool.awaitTermination(
                drainTimeout.toMillis(), TimeUnit.MILLISECONDS);

        if (drained) {
            log.info("All in-flight jobs completed. Clean shutdown.");
        } else {
            int remaining = inFlightJobs.size();
            log.warn("Drain timeout expired. {} jobs still running. Forcing shutdown.",
                    remaining);
            workerPool.shutdownNow();  // force-kill stragglers
        }
    } catch (InterruptedException e) {
        log.warn("Graceful shutdown interrupted. Forcing shutdown.");
        workerPool.shutdownNow();
        Thread.currentThread().interrupt();
    } finally {
        timeoutScheduler.shutdown();
        drainComplete.countDown();
    }
}

/**
 * Returns true if the engine is draining (shutting down gracefully).
 * Used by the health check to return 503.
 */
public boolean isDraining() {
    return draining;
}

/**
 * Block until the drain is complete.
 */
public void awaitDrainComplete(long timeout, TimeUnit unit)
        throws InterruptedException {
    drainComplete.await(timeout, unit);
}
```

The key difference from `shutdownNow()`:

| | `shutdownNow()` | `gracefulShutdown()` |
|---|---|---|
| New jobs | Rejected | Rejected |
| In-flight jobs | Interrupted immediately | Allowed to finish |
| Queue | Abandoned | Drained (workers finish current job, stop polling) |
| Timeout | None | Configurable drain period |
| Fallback | — | `shutdownNow()` after timeout |

### Update `submit()` to Reject During Drain

```java
public boolean submit(Job job) {
    if (!running || draining) return false;  // ← reject during drain
    // ... rest of submit logic
}
```

### The JVM Shutdown Hook

When Kubernetes sends `SIGTERM`, the JVM runs shutdown hooks before exiting. This is where you trigger the graceful shutdown.

```java
// src/main/java/com/jobengine/lifecycle/GracefulShutdownHook.java
package com.jobengine.lifecycle;

import com.jobengine.engine.JobEngine;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class GracefulShutdownHook {

    private static final Logger log = LoggerFactory.getLogger(GracefulShutdownHook.class);

    private final JobEngine engine;
    private final Duration drainTimeout;

    public GracefulShutdownHook(
            JobEngine engine,
            @Value("${app.shutdown.drain-timeout-seconds:30}") int drainTimeoutSeconds) {
        this.engine = engine;
        this.drainTimeout = Duration.ofSeconds(drainTimeoutSeconds);
    }

    @PreDestroy
    public void onShutdown() {
        log.info("SIGTERM received. Starting graceful shutdown...");
        engine.gracefulShutdown(drainTimeout);
        log.info("Graceful shutdown complete.");
    }
}
```

`@PreDestroy` fires when Spring shuts down the application context — which happens on `SIGTERM`. The drain timeout is configurable via environment variable.

### Health Check Returns 503 During Drain

The load balancer polls `/actuator/health`. During the drain period, it should return 503 so the load balancer stops sending new requests to this pod.

```java
// src/main/java/com/jobengine/lifecycle/EngineHealthIndicator.java
package com.jobengine.lifecycle;

import com.jobengine.engine.JobEngine;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class EngineHealthIndicator implements HealthIndicator {

    private final JobEngine engine;

    public EngineHealthIndicator(JobEngine engine) {
        this.engine = engine;
    }

    @Override
    public Health health() {
        if (engine.isDraining()) {
            return Health.outOfService()
                    .withDetail("reason", "Graceful shutdown in progress")
                    .withDetail("inFlightJobs", engine.getInFlightCount())
                    .build();
        }

        return Health.up()
                .withDetail("queueSize", engine.getQueueSize())
                .withDetail("inFlightJobs", engine.getInFlightCount())
                .build();
    }
}
```

Add a helper method to `JobEngine`:

```java
public int getInFlightCount() {
    return inFlightJobs.size();
}
```

During normal operation:

```json
GET /actuator/health → 200
{"status": "UP", "details": {"queueSize": 42, "inFlightJobs": 3}}
```

During drain:

```json
GET /actuator/health → 503
{"status": "OUT_OF_SERVICE", "details": {"reason": "Graceful shutdown in progress", "inFlightJobs": 2}}
```

The load balancer sees 503, removes this pod from rotation, and sends new requests to the other replicas. The draining pod finishes its in-flight jobs in peace.

### Spring Boot Configuration

```yaml
# application.yml — add to existing config
spring:
  lifecycle:
    timeout-per-shutdown-phase: 35s  # slightly longer than drain timeout

server:
  shutdown: graceful  # Spring Boot's built-in graceful shutdown for HTTP connections

app:
  shutdown:
    drain-timeout-seconds: ${DRAIN_TIMEOUT:30}
```

### Kubernetes Configuration

Kubernetes sends `SIGTERM` and waits `terminationGracePeriodSeconds` before sending `SIGKILL`. This must be longer than your drain timeout.

```yaml
# k8s/deployment.yaml — update the container spec
spec:
  terminationGracePeriodSeconds: 45  # > drain timeout (30s) + buffer
  containers:
    - name: job-engine
      # ... existing config
      lifecycle:
        preStop:
          exec:
            command: ["sleep", "5"]  # give load balancer time to deregister
```

The timeline:

```
0s:  SIGTERM sent to pod
0s:  preStop hook: sleep 5s (load balancer deregisters the pod)
5s:  Spring receives shutdown signal
5s:  @PreDestroy fires → gracefulShutdown(30s)
5s:  Health check returns 503
5s:  Engine stops accepting new jobs
5s:  Workers finish in-flight jobs...
~15s: All jobs complete (or 35s timeout)
35s: Pod exits cleanly
45s: Kubernetes SIGKILL deadline (never reached)
```

## The Test That Proves the Fix

```java
@Test
void gracefulShutdownShouldLetInFlightJobsFinish() throws InterruptedException {
    JobEngine engine = new JobEngine(4, 1000);
    CountDownLatch jobStarted = new CountDownLatch(1);
    AtomicBoolean jobCompleted = new AtomicBoolean(false);

    Job longJob = new Job("1", "cfo-report", JobPriority.CRITICAL,
            Duration.ofMinutes(5),
            () -> {
                jobStarted.countDown();
                try {
                    Thread.sleep(2000); // simulate 2 seconds of work
                    jobCompleted.set(true);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }, null);

    engine.submit(longJob);
    jobStarted.await();

    // Graceful shutdown with 10 second drain timeout
    Thread shutdownThread = new Thread(() ->
            engine.gracefulShutdown(Duration.ofSeconds(10)));
    shutdownThread.start();

    // Wait for shutdown to complete
    shutdownThread.join(15_000);

    // ✅ PASSES — job was allowed to finish
    assertThat(jobCompleted.get()).isTrue();
}

@Test
void shouldRejectNewJobsDuringDrain() throws InterruptedException {
    JobEngine engine = new JobEngine(4, 1000);
    CountDownLatch blocker = new CountDownLatch(1);

    // Submit a blocking job so the engine has something in-flight
    engine.submit(new Job("blocker", "block", JobPriority.LOW,
            Duration.ofSeconds(30), () -> {
                try { blocker.await(); }
                catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            }, null));
    Thread.sleep(200);

    // Start graceful shutdown in background
    Thread.ofVirtual().start(() -> engine.gracefulShutdown(Duration.ofSeconds(10)));
    Thread.sleep(100); // let drain start

    // Try to submit a new job — should be rejected
    Job newJob = new Job("new", "rejected", JobPriority.NORMAL,
            Duration.ofSeconds(5), () -> {}, null);
    assertThat(engine.submit(newJob)).isFalse();

    // Engine should report draining
    assertThat(engine.isDraining()).isTrue();

    blocker.countDown(); // unblock so shutdown can complete
}

@Test
void shouldForceKillAfterDrainTimeout() throws InterruptedException {
    JobEngine engine = new JobEngine(4, 1000);
    CountDownLatch jobStarted = new CountDownLatch(1);

    // A job that takes forever
    Job infiniteJob = new Job("1", "infinite", JobPriority.NORMAL,
            Duration.ofMinutes(60),
            () -> {
                jobStarted.countDown();
                try { Thread.sleep(Long.MAX_VALUE); }
                catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            }, null);

    engine.submit(infiniteJob);
    jobStarted.await();

    // Graceful shutdown with 1 second drain timeout
    long start = System.currentTimeMillis();
    engine.gracefulShutdown(Duration.ofSeconds(1));
    long elapsed = System.currentTimeMillis() - start;

    // Should have force-killed after ~1 second, not waited forever
    assertThat(elapsed).isLessThan(3000);
}

@Test
void healthCheckShouldReturn503DuringDrain() {
    JobEngine engine = new JobEngine(4, 1000);
    EngineHealthIndicator indicator = new EngineHealthIndicator(engine);

    // Before drain — UP
    assertThat(indicator.health().getStatus().getCode()).isEqualTo("UP");

    // Start drain
    Thread.ofVirtual().start(() -> engine.gracefulShutdown(Duration.ofSeconds(5)));

    // Small delay to let drain flag set
    try { Thread.sleep(100); } catch (InterruptedException e) {}

    // During drain — OUT_OF_SERVICE
    assertThat(indicator.health().getStatus().getCode()).isEqualTo("OUT_OF_SERVICE");
}
```

Four tests:
1. In-flight jobs finish during graceful shutdown ✅
2. New jobs are rejected during drain ✅
3. Force-kill fires after the drain timeout ✅
4. Health check returns 503 during drain ✅

## The Deploy — Take Two

FiveNines deploys the same config change. This time:

```
2:15:00 PM  SIGTERM → preStop sleep 5s
2:15:05 PM  Graceful shutdown starts. 3 in-flight jobs.
2:15:05 PM  Health check → 503. Load balancer deregisters pod.
2:15:05 PM  New requests go to other replicas.
2:15:08 PM  Job "email-batch" completes. 2 remaining.
2:15:12 PM  Job "payment-reconcile" completes. 1 remaining.
2:15:19 PM  Job "cfo-report" completes. 0 remaining.
2:15:19 PM  All jobs drained. Pod exits cleanly.
```

Zero orphaned jobs. Zero failed reports. The CFO gets the report at 2:30.

> **@FiveNines:** Zero orphans. Zero alerts. That's what a deploy should look like.

> **@Linus:** Add it to the deployment checklist: "Drain timeout > longest expected job duration."

> **@TicketMaster:** Already filed the ticket.

---

[← Chapter 13: 47 Jobs in 3 Seconds](part-13-rate-limiting.md) | [Series Overview](README.md)
