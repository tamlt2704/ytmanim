package com.jobengine.model;

import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JobTest {

    @Test
    void shouldStartAsPending() {
        Job job = new Job("1", "test", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, null);
        assertThat(job.getStatus()).isEqualTo(JobStatus.PENDING);
    }

    @Test
    void shouldTransitionWithCAS() {
        Job job = new Job("1", "test", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, null);

        assertThat(job.transitionTo(JobStatus.PENDING, JobStatus.RUNNING)).isTrue();
        assertThat(job.getStatus()).isEqualTo(JobStatus.RUNNING);

        // Can't transition from PENDING again (already RUNNING)
        assertThat(job.transitionTo(JobStatus.PENDING, JobStatus.RUNNING)).isFalse();
    }

    @Test
    void shouldCancelOnlyWhenPending() {
        Job job = new Job("1", "test", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, null);
        assertThat(job.cancel()).isTrue();
        assertThat(job.getStatus()).isEqualTo(JobStatus.CANCELLED);

        // Can't cancel again
        Job job2 = new Job("2", "test", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, null);
        job2.transitionTo(JobStatus.PENDING, JobStatus.RUNNING);
        assertThat(job2.cancel()).isFalse(); // already running
    }

    @Test
    void shouldOrderByPriorityThenSubmissionTime() throws InterruptedException {
        Job low = new Job("1", "low", JobPriority.LOW, Duration.ofSeconds(5), () -> {}, null);
        Thread.sleep(10);
        Job high = new Job("2", "high", JobPriority.HIGH, Duration.ofSeconds(5), () -> {}, null);
        Thread.sleep(10);
        Job critical = new Job("3", "critical", JobPriority.CRITICAL, Duration.ofSeconds(5), () -> {}, null);

        assertThat(critical.compareTo(high)).isLessThan(0);   // critical before high
        assertThat(high.compareTo(low)).isLessThan(0);         // high before low
    }

    @Test
    void shouldHaveImmutableDependencies() {
        Job job = new Job("1", "test", JobPriority.NORMAL, Duration.ofSeconds(5), () -> {},
                List.of("dep1", "dep2"));
        assertThat(job.getDependsOn()).containsExactly("dep1", "dep2");
    }
}
