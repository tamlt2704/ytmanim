package com.jobengine.engine;

import com.jobengine.model.Job;
import com.jobengine.model.JobPriority;
import com.jobengine.model.JobStatus;
import org.junit.jupiter.api.*;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class JobEngineTest {

    private JobEngine engine;

    @BeforeEach
    void setUp() {
        engine = new JobEngine(4, 1000);
    }

    @AfterEach
    void tearDown() throws InterruptedException {
        engine.shutdownNow();
        engine.awaitTermination(5, TimeUnit.SECONDS);
    }

    // ========== Basic Execution ==========

    @Test
    void shouldExecuteSimpleJob() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        Job job = new Job("1", "simple", JobPriority.NORMAL, Duration.ofSeconds(5),
                latch::countDown, null);

        engine.submit(job);
        assertThat(latch.await(5, TimeUnit.SECONDS)).isTrue();

        Thread.sleep(100); // let status update propagate
        assertThat(job.getStatus()).isEqualTo(JobStatus.COMPLETED);
        assertThat(engine.getMetrics().getCompleted()).isEqualTo(1);
    }

    @Test
    void shouldHandleFailingJob() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        Job job = new Job("1", "failing", JobPriority.NORMAL, Duration.ofSeconds(5),
                () -> {
                    latch.countDown();
                    throw new RuntimeException("Boom");
                }, null);

        engine.submit(job);
        assertThat(latch.await(5, TimeUnit.SECONDS)).isTrue();

        Thread.sleep(200);
        assertThat(job.getStatus()).isEqualTo(JobStatus.FAILED);
        assertThat(job.getFailureReason()).isEqualTo("Boom");
        assertThat(engine.getMetrics().getFailed()).isEqualTo(1);
    }

    // ========== Priority Ordering ==========

    @Test
    void shouldProcessHighPriorityFirst() throws InterruptedException {
        // Pause the engine by filling it with a blocking job
        CountDownLatch blocker = new CountDownLatch(1);
        CountDownLatch gate = new CountDownLatch(1);

        // Block all workers
        for (int i = 0; i < 4; i++) {
            engine.submit(new Job("blocker-" + i, "block", JobPriority.LOW, Duration.ofSeconds(10),
                    () -> {
                        try { blocker.await(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                    }, null));
        }

        Thread.sleep(200); // let blockers start

        // Submit jobs in reverse priority order
        List<String> executionOrder = Collections.synchronizedList(new ArrayList<>());
        CountDownLatch done = new CountDownLatch(3);

        engine.submit(new Job("low", "low", JobPriority.LOW, Duration.ofSeconds(5),
                () -> { executionOrder.add("LOW"); done.countDown(); }, null));
        engine.submit(new Job("critical", "critical", JobPriority.CRITICAL, Duration.ofSeconds(5),
                () -> { executionOrder.add("CRITICAL"); done.countDown(); }, null));
        engine.submit(new Job("high", "high", JobPriority.HIGH, Duration.ofSeconds(5),
                () -> { executionOrder.add("HIGH"); done.countDown(); }, null));

        // Release blockers
        blocker.countDown();
        assertThat(done.await(10, TimeUnit.SECONDS)).isTrue();

        // CRITICAL should execute before HIGH, HIGH before LOW
        assertThat(executionOrder.indexOf("CRITICAL")).isLessThan(executionOrder.indexOf("LOW"));
    }

    // ========== Timeout ==========

    @Test
    void shouldTimeoutLongRunningJob() throws InterruptedException {
        Job job = new Job("1", "slow", JobPriority.NORMAL, Duration.ofMillis(200),
                () -> {
                    try { Thread.sleep(10000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                }, null);

        engine.submit(job);
        Thread.sleep(500); // wait past timeout

        assertThat(job.getStatus()).isEqualTo(JobStatus.TIMED_OUT);
        assertThat(engine.getMetrics().getTimedOut()).isEqualTo(1);
    }

    // ========== Cancellation ==========

    @Test
    void shouldCancelPendingJob() throws InterruptedException {
        // Fill workers so new jobs stay in queue
        CountDownLatch blocker = new CountDownLatch(1);
        for (int i = 0; i < 4; i++) {
            engine.submit(new Job("blocker-" + i, "block", JobPriority.LOW, Duration.ofSeconds(10),
                    () -> {
                        try { blocker.await(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                    }, null));
        }
        Thread.sleep(200);

        Job cancelMe = new Job("cancel", "cancel", JobPriority.NORMAL, Duration.ofSeconds(5),
                () -> {}, null);
        engine.submit(cancelMe);

        assertThat(engine.cancel("cancel")).isTrue();
        assertThat(cancelMe.getStatus()).isEqualTo(JobStatus.CANCELLED);

        blocker.countDown();
    }

    // ========== Concurrency Safety ==========

    @Test
    void shouldHandleMassiveConcurrentSubmission() throws InterruptedException {
        int totalJobs = 1000;
        CountDownLatch allDone = new CountDownLatch(totalJobs);
        AtomicInteger executedCount = new AtomicInteger(0);

        for (int i = 0; i < totalJobs; i++) {
            Job job = new Job("job-" + i, "mass-" + i, JobPriority.NORMAL, Duration.ofSeconds(30),
                    () -> {
                        executedCount.incrementAndGet();
                        allDone.countDown();
                    }, null);
            engine.submit(job);
        }

        assertThat(allDone.await(30, TimeUnit.SECONDS)).isTrue();
        assertThat(executedCount.get()).isEqualTo(totalJobs);
        assertThat(engine.getMetrics().getSubmitted()).isEqualTo(totalJobs);
    }

    /**
     * Verifies no race condition on status transitions.
     * Multiple threads try to transition the same job — only one should succeed.
     */
    @Test
    void shouldPreventDoubleExecution() throws InterruptedException {
        AtomicInteger executionCount = new AtomicInteger(0);
        Job job = new Job("1", "test", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, null);

        int threads = 100;
        CountDownLatch latch = new CountDownLatch(threads);

        try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < threads; i++) {
                executor.submit(() -> {
                    if (job.transitionTo(JobStatus.PENDING, JobStatus.RUNNING)) {
                        executionCount.incrementAndGet();
                    }
                    latch.countDown();
                });
            }
            latch.await();
        }

        // Exactly one thread should win the CAS
        assertThat(executionCount.get()).isEqualTo(1);
    }

    // ========== Dependencies ==========

    @Test
    void shouldRejectCircularDependency() {
        Job a = new Job("A", "a", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, List.of("B"));
        Job b = new Job("B", "b", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, List.of("A"));

        engine.submit(a);
        assertThat(engine.submit(b)).isFalse(); // circular dependency
    }

    // ========== Backpressure ==========

    @Test
    void shouldRejectWhenQueueFull() throws InterruptedException {
        // Use 0 workers so nothing gets consumed — queue fills up deterministically
        JobEngine smallEngine = new JobEngine(0, 5);

        for (int i = 0; i < 5; i++) {
            assertThat(smallEngine.submit(new Job("job-" + i, "fill", JobPriority.NORMAL,
                    Duration.ofSeconds(10), () -> {}, null))).isTrue();
        }

        // 6th should be rejected — queue is full and no workers are draining it
        Job overflow = new Job("overflow", "overflow", JobPriority.NORMAL, Duration.ofSeconds(5),
                () -> {}, null);
        assertThat(smallEngine.submit(overflow)).isFalse();

        smallEngine.shutdownNow();
    }
}
