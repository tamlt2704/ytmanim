package com.jobengine.dependency;

import com.jobengine.model.Job;
import com.jobengine.model.JobPriority;
import com.jobengine.model.JobStatus;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DependencyResolverTest {

    private Job job(String id, List<String> deps) {
        return new Job(id, "job-" + id, JobPriority.NORMAL, Duration.ofSeconds(5), () -> {}, deps);
    }

    @Test
    void shouldDetectCircularDependency() {
        DependencyResolver resolver = new DependencyResolver();

        Job a = job("A", List.of("B"));
        Job b = job("B", List.of("A")); // A→B→A = cycle

        resolver.register(a);

        assertThat(resolver.hasCircularDependency(b)).isTrue();
    }

    @Test
    void shouldAllowLinearDependencies() {
        DependencyResolver resolver = new DependencyResolver();

        Job a = job("A", List.of());
        Job b = job("B", List.of("A"));
        Job c = job("C", List.of("B")); // C→B→A = linear chain

        resolver.register(a);
        resolver.register(b);

        assertThat(resolver.hasCircularDependency(c)).isFalse();
    }

    @Test
    void shouldDetectTransitiveCycle() {
        DependencyResolver resolver = new DependencyResolver();

        Job a = job("A", List.of("C")); // A→C
        Job b = job("B", List.of("A")); // B→A
        Job c = job("C", List.of("B")); // C→B→A→C = cycle

        resolver.register(a);
        resolver.register(b);

        assertThat(resolver.hasCircularDependency(c)).isTrue();
    }

    @Test
    void shouldCheckDependenciesMet() {
        DependencyResolver resolver = new DependencyResolver();

        Job dep = job("dep1", List.of());
        resolver.register(dep);

        Job dependent = job("main", List.of("dep1"));
        resolver.register(dependent);

        // dep1 is PENDING — not met
        assertThat(resolver.areDependenciesMet(dependent)).isFalse();

        // Complete dep1
        dep.transitionTo(JobStatus.PENDING, JobStatus.RUNNING);
        dep.transitionTo(JobStatus.RUNNING, JobStatus.COMPLETED);

        assertThat(resolver.areDependenciesMet(dependent)).isTrue();
    }

    @Test
    void shouldHandleNoDependencies() {
        DependencyResolver resolver = new DependencyResolver();
        Job job = job("solo", List.of());
        assertThat(resolver.areDependenciesMet(job)).isTrue();
        assertThat(resolver.hasCircularDependency(job)).isFalse();
    }
}
