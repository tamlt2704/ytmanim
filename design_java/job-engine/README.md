# Concurrent Job Processing Engine

A thread-safe job processing engine built with Java 21 that demonstrates and solves classic multithreading problems: race conditions, deadlocks, visibility, priority inversion, starvation, and backpressure.

## Prerequisites

- Java 21

## Build & Test

```bash
./gradlew test
```

No external infrastructure needed — pure in-memory concurrency.

## Core Components

| Component | Pattern | Problem Solved |
|-----------|---------|----------------|
| `Job` | AtomicReference + CAS | Race conditions on status transitions |
| `JobEngine` | Producer-Consumer | Priority ordering, timeout, cancellation |
| `JobMetrics` | LongAdder / AtomicLong | Lost increments under contention |
| `BoundedResourcePool` | Blocking Queue | Resource exhaustion, thread starvation |
| `DependencyResolver` | DFS cycle detection | Deadlocks from circular dependencies |

## Tests (26 tests)

**JobTest (5):** CAS transitions, cancel semantics, priority ordering, immutable deps

**JobMetricsTest (4):** Basic tracking, active jobs, 100-thread concurrent increment (no lost updates), reset

**BoundedResourcePoolTest (3):** Acquire/release, blocking on exhaustion, 50-thread concurrent access (no leaks)

**DependencyResolverTest (5):** Circular detection, linear chains, transitive cycles, dependency-met check, no-deps

**JobEngineTest (9):** Simple execution, failure handling, priority ordering, timeout, cancellation, 1000-job concurrent submission, double-execution prevention (100 threads CAS race), circular dependency rejection, backpressure

See [TECHNICAL_CHALLENGES.md](TECHNICAL_CHALLENGES.md) for detailed write-up of each concurrency problem and solution.
