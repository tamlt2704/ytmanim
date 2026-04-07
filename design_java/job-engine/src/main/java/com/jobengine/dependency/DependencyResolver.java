package com.jobengine.dependency;

import com.jobengine.model.Job;
import com.jobengine.model.JobStatus;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Resolves job dependencies and detects circular dependencies (deadlocks).
 *
 * Problem solved: DEADLOCK DETECTION
 * - Circular dependencies between jobs would cause indefinite waiting
 * - Uses DFS cycle detection before accepting a job
 * - ConcurrentHashMap for thread-safe job registry
 */
public class DependencyResolver {

    private final ConcurrentHashMap<String, Job> jobRegistry = new ConcurrentHashMap<>();

    public void register(Job job) {
        jobRegistry.put(job.getId(), job);
    }

    public void remove(String jobId) {
        jobRegistry.remove(jobId);
    }

    /**
     * Returns true if all dependencies of the given job are completed.
     */
    public boolean areDependenciesMet(Job job) {
        for (String depId : job.getDependsOn()) {
            Job dep = jobRegistry.get(depId);
            if (dep == null) continue; // dependency not registered = assume met
            if (dep.getStatus() != JobStatus.COMPLETED) {
                return false;
            }
        }
        return true;
    }

    /**
     * Detects circular dependencies using DFS.
     * Returns true if adding this job would create a cycle.
     */
    public boolean hasCircularDependency(Job job) {
        Set<String> visited = new HashSet<>();
        Set<String> inStack = new HashSet<>();
        return hasCycleDFS(job.getId(), visited, inStack, job);
    }

    private boolean hasCycleDFS(String jobId, Set<String> visited, Set<String> inStack, Job newJob) {
        if (inStack.contains(jobId)) return true; // cycle detected
        if (visited.contains(jobId)) return false;

        visited.add(jobId);
        inStack.add(jobId);

        List<String> deps = jobId.equals(newJob.getId())
                ? newJob.getDependsOn()
                : Optional.ofNullable(jobRegistry.get(jobId)).map(Job::getDependsOn).orElse(List.of());

        for (String depId : deps) {
            if (hasCycleDFS(depId, visited, inStack, newJob)) {
                return true;
            }
        }

        inStack.remove(jobId);
        return false;
    }

    public Job getJob(String id) { return jobRegistry.get(id); }
}
