package com.jobengine.engine;

import com.jobengine.dependency.DependencyResolver;
import com.jobengine.metrics.JobMetrics;
import com.jobengine.model.Job;
import com.jobengine.model.JobStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.*;

/**
 * Core job processing engine.
 *
 * Problems solved:
 *
 * 1. PRODUCER-CONSUMER with BACKPRESSURE
 *    - PriorityBlockingQueue decouples submission from processing
 *    - Bounded queue capacity prevents OOM from unbounded submission
 *
 * 2. PRIORITY INVERSION
 *    - PriorityBlockingQueue ensures CRITICAL jobs are dequeued before LOW
 *    - Within same priority, FIFO ordering by submission time
 *
 * 3. THREAD STARVATION from long-running jobs
 *    - Per-job timeout with Future.get(timeout) + cancellation
 *    - Timed-out jobs are interrupted and marked TIMED_OUT
 *
 * 4. SAFE SHUTDOWN
 *    - shutdown() stops accepting new jobs, drains in-flight work
 *    - shutdownNow() interrupts all workers for fast termination
 */
public class JobEngine {

    private static final Logger log = LoggerFactory.getLogger(JobEngine.class);

    private final PriorityBlockingQueue<Job> queue;
    private final ExecutorService workerPool;
    private final ScheduledExecutorService timeoutScheduler;
    private final JobMetrics metrics;
    private final DependencyResolver dependencyResolver;
    private final int maxQueueSize;
    private volatile boolean running = true;

    // Track in-flight jobs for cancellation
    private final ConcurrentHashMap<String, Future<?>> inFlightJobs = new ConcurrentHashMap<>();

    public JobEngine(int workerCount, int maxQueueSize) {
        this.maxQueueSize = maxQueueSize;
        this.queue = new PriorityBlockingQueue<>(maxQueueSize);
        this.workerPool = Executors.newVirtualThreadPerTaskExecutor();
        this.timeoutScheduler = Executors.newScheduledThreadPool(1, r -> {
            Thread t = new Thread(r, "timeout-scheduler");
            t.setDaemon(true);
            return t;
        });
        this.metrics = new JobMetrics();
        this.dependencyResolver = new DependencyResolver();

        // Start worker threads that poll from the priority queue
        for (int i = 0; i < workerCount; i++) {
            Thread.ofVirtual().name("worker-" + i).start(this::workerLoop);
        }
    }

    /**
     * Submit a job. Returns false if queue is full (backpressure) or circular dependency detected.
     */
    public boolean submit(Job job) {
        if (!running) return false;

        // Deadlock detection
        if (dependencyResolver.hasCircularDependency(job)) {
            log.warn("Circular dependency detected for job {}", job.getId());
            return false;
        }

        // Backpressure: reject if queue is full
        if (queue.size() >= maxQueueSize) {
            log.warn("Queue full, rejecting job {}", job.getId());
            return false;
        }

        dependencyResolver.register(job);
        queue.offer(job);
        metrics.recordSubmitted();
        log.debug("Job {} submitted with priority {}", job.getId(), job.getPriority());
        return true;
    }

    /**
     * Cancel a pending job.
     */
    public boolean cancel(String jobId) {
        Job job = dependencyResolver.getJob(jobId);
        if (job == null) return false;

        if (job.cancel()) {
            metrics.recordCancelled();
            log.info("Job {} cancelled", jobId);
            return true;
        }

        // If already running, interrupt it
        Future<?> future = inFlightJobs.get(jobId);
        if (future != null) {
            future.cancel(true);
            job.transitionTo(JobStatus.RUNNING, JobStatus.CANCELLED);
            metrics.recordCancelled();
            metrics.decrementActive();
            return true;
        }

        return false;
    }

    /**
     * Worker loop — polls jobs from the priority queue and executes them.
     */
    private void workerLoop() {
        while (running) {
            try {
                Job job = queue.poll(1, TimeUnit.SECONDS);
                if (job == null) continue;

                // Skip cancelled jobs
                if (job.getStatus() == JobStatus.CANCELLED) continue;

                // Check dependencies
                if (!dependencyResolver.areDependenciesMet(job)) {
                    // Re-queue with a small delay to avoid busy-waiting
                    queue.offer(job);
                    Thread.sleep(100);
                    continue;
                }

                // CAS transition: PENDING → RUNNING (prevents double-execution)
                if (!job.transitionTo(JobStatus.PENDING, JobStatus.RUNNING)) {
                    continue; // another thread got it, or it was cancelled
                }

                executeJob(job);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    private void executeJob(Job job) {
        metrics.incrementActive();
        job.setStartedAt(Instant.now());

        // Submit to get a Future for timeout control
        Future<?> future = CompletableFuture.runAsync(job.getTask(), workerPool);
        inFlightJobs.put(job.getId(), future);

        // Schedule timeout
        ScheduledFuture<?> timeoutFuture = null;
        if (job.getTimeout() != null && !job.getTimeout().isZero()) {
            timeoutFuture = timeoutScheduler.schedule(() -> {
                if (job.getStatus() == JobStatus.RUNNING) {
                    future.cancel(true);
                    job.transitionTo(JobStatus.RUNNING, JobStatus.TIMED_OUT);
                    job.setCompletedAt(Instant.now());
                    metrics.decrementActive();
                    metrics.recordTimedOut();
                    log.warn("Job {} timed out after {}", job.getId(), job.getTimeout());
                }
            }, job.getTimeout().toMillis(), TimeUnit.MILLISECONDS);
        }

        try {
            future.get(); // block until completion or cancellation

            if (job.getStatus() == JobStatus.RUNNING) {
                job.transitionTo(JobStatus.RUNNING, JobStatus.COMPLETED);
                job.setCompletedAt(Instant.now());
                long elapsed = Duration.between(job.getStartedAt(), job.getCompletedAt()).toMillis();
                metrics.recordCompleted(elapsed);
            }
        } catch (CancellationException e) {
            // Timeout or manual cancel already handled
        } catch (ExecutionException e) {
            if (job.getStatus() == JobStatus.RUNNING) {
                job.transitionTo(JobStatus.RUNNING, JobStatus.FAILED);
                job.setFailureReason(e.getCause().getMessage());
                job.setCompletedAt(Instant.now());
                metrics.recordFailed();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            inFlightJobs.remove(job.getId());
            if (job.getStatus() == JobStatus.RUNNING) {
                metrics.decrementActive();
            } else if (job.getStatus() == JobStatus.COMPLETED || job.getStatus() == JobStatus.FAILED) {
                metrics.decrementActive();
            }
            if (timeoutFuture != null) {
                timeoutFuture.cancel(false);
            }
        }
    }

    public void shutdown() {
        running = false;
        workerPool.shutdown();
        timeoutScheduler.shutdown();
    }

    public void shutdownNow() {
        running = false;
        workerPool.shutdownNow();
        timeoutScheduler.shutdownNow();
    }

    public boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException {
        return workerPool.awaitTermination(timeout, unit);
    }

    public JobMetrics getMetrics() { return metrics; }
    public DependencyResolver getDependencyResolver() { return dependencyResolver; }
    public int getQueueSize() { return queue.size(); }
}
