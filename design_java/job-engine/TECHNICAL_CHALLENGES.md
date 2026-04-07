# Technical Challenges: Concurrent Job Processing Engine

## Goal

Build a thread-safe job processing engine that demonstrates and solves the classic multithreading problems: race conditions, deadlocks, visibility issues, priority inversion, thread starvation, and backpressure.

---

## Problem 1: Race Conditions on Shared State

### The Problem

Multiple threads read and write job status simultaneously. Without synchronization:
- Thread A reads status = PENDING
- Thread B reads status = PENDING
- Both transition to RUNNING → job executes twice

This is the classic lost-update / check-then-act race condition.

### The Solution — AtomicReference with CAS

```java
private final AtomicReference<JobStatus> status = new AtomicReference<>(JobStatus.PENDING);

public boolean transitionTo(JobStatus expected, JobStatus next) {
    return status.compareAndSet(expected, next);
}
```

Compare-And-Swap (CAS) is an atomic CPU instruction. It reads the current value, compares it to `expected`, and only writes `next` if they match — all in one indivisible operation. If another thread changed the value between read and write, CAS fails and returns false.

### Test Proof

```java
// 100 threads race to transition PENDING → RUNNING
// Exactly 1 wins the CAS, 99 get false
assertThat(executionCount.get()).isEqualTo(1);
```

---

## Problem 2: Visibility Issues (Missing Happens-Before)

### The Problem

In the Java Memory Model, writes by one thread are not guaranteed to be visible to other threads without a happens-before relationship. A thread could set `startedAt = Instant.now()` but another thread reads `null` because the write is still in the CPU cache.

### The Solution — volatile + Atomic classes

```java
// volatile ensures writes are flushed to main memory immediately
private volatile Instant startedAt;
private volatile Instant completedAt;
private volatile String failureReason;

// AtomicReference provides both atomicity AND visibility
private final AtomicReference<JobStatus> status = new AtomicReference<>(JobStatus.PENDING);
```

- `volatile` establishes a happens-before edge: a write to a volatile field is visible to all subsequent reads of that field by any thread
- `AtomicReference` internally uses `volatile` + CAS, giving both atomicity and visibility
- Immutable fields (`id`, `priority`, `timeout`) are safely published through the constructor's happens-before guarantee

---

## Problem 3: Race Conditions on Counters (Lost Increments)

### The Problem

A simple `count++` is three operations: read, increment, write. Under concurrency:
- Thread A reads count = 5
- Thread B reads count = 5
- Thread A writes 6
- Thread B writes 6
- Result: 6 instead of 7 (lost increment)

### The Solution — LongAdder for High-Contention Counters

```java
private final LongAdder submitted = new LongAdder();  // write-heavy
private final AtomicLong activeJobs = new AtomicLong(0); // read-heavy
```

- `LongAdder` stripes the counter across CPU cores. Each core increments its own cell, and `sum()` aggregates them. Under high contention, this is dramatically faster than `AtomicLong` because threads don't contend on the same cache line.
- `AtomicLong` is used for `activeJobs` because we need exact point-in-time reads (not just eventual sums).

### Test Proof

```java
// 100 threads × 1000 increments = 100,000 expected
// LongAdder loses zero increments
assertThat(metrics.getSubmitted()).isEqualTo(100_000L);
```

---

## Problem 4: Priority Inversion and Thread Starvation

### The Problem

With a simple FIFO queue, a flood of LOW priority jobs can starve CRITICAL jobs. If 10,000 LOW jobs are queued and a CRITICAL alert arrives, it waits behind all of them.

### The Solution — PriorityBlockingQueue

```java
private final PriorityBlockingQueue<Job> queue;

// Job implements Comparable — higher priority dequeued first
public int compareTo(Job other) {
    int cmp = Integer.compare(other.priority.getWeight(), this.priority.getWeight());
    if (cmp != 0) return cmp;
    return this.submittedAt.compareTo(other.submittedAt); // FIFO within same priority
}
```

- `PriorityBlockingQueue` is a thread-safe heap that dequeues the highest-priority element
- Within the same priority, FIFO ordering by submission time prevents starvation among peers
- CRITICAL (weight=3) always dequeues before LOW (weight=0)

### Test Proof

```java
// Submit LOW, then CRITICAL, then HIGH while workers are blocked
// After unblocking: CRITICAL executes before LOW
assertThat(executionOrder.indexOf("CRITICAL")).isLessThan(executionOrder.indexOf("LOW"));
```

---

## Problem 5: Thread Starvation from Long-Running Jobs

### The Problem

A job that runs for 10 minutes holds a worker thread hostage. With a fixed thread pool, enough long-running jobs can consume all workers, preventing any new jobs from executing — even CRITICAL ones.

### The Solution — Per-Job Timeout with Cancellation

```java
ScheduledFuture<?> timeoutFuture = timeoutScheduler.schedule(() -> {
    if (job.getStatus() == JobStatus.RUNNING) {
        future.cancel(true);  // interrupt the thread
        job.transitionTo(JobStatus.RUNNING, JobStatus.TIMED_OUT);
    }
}, job.getTimeout().toMillis(), TimeUnit.MILLISECONDS);
```

- Each job has a configurable `Duration timeout`
- A dedicated `ScheduledExecutorService` fires after the timeout and cancels the `Future`
- `cancel(true)` sends an interrupt to the worker thread
- The job is marked `TIMED_OUT` and the worker is freed for the next job

### Test Proof

```java
// Job sleeps for 10s but has 200ms timeout
// After 500ms: status is TIMED_OUT
assertThat(job.getStatus()).isEqualTo(JobStatus.TIMED_OUT);
```

---

## Problem 6: Deadlocks from Circular Dependencies

### The Problem

Job A depends on Job B, Job B depends on Job A. Both wait for each other to complete — indefinite hang. With transitive dependencies (A→B→C→A), the cycle is harder to detect.

### The Solution — DFS Cycle Detection Before Submission

```java
public boolean hasCircularDependency(Job job) {
    Set<String> visited = new HashSet<>();
    Set<String> inStack = new HashSet<>();
    return hasCycleDFS(job.getId(), visited, inStack, job);
}
```

- Before accepting a job, the engine runs DFS on the dependency graph
- `inStack` tracks the current recursion path — if we revisit a node in the stack, it's a cycle
- Circular jobs are rejected at submission time with `submit()` returning `false`
- `ConcurrentHashMap` for the job registry ensures thread-safe reads during cycle detection

### Test Proof

```java
// A depends on B, B depends on A
engine.submit(a); // succeeds
assertThat(engine.submit(b)).isFalse(); // rejected — circular
```

---

## Problem 7: Resource Exhaustion and Backpressure

### The Problem

If producers submit jobs faster than workers can process them, the queue grows unboundedly → OutOfMemoryError. This is the classic unbounded producer-consumer problem.

### The Solution — Bounded Queue with Rejection

```java
if (queue.size() >= maxQueueSize) {
    log.warn("Queue full, rejecting job {}", job.getId());
    return false;
}
```

For shared resources (DB connections, API clients), a `BoundedResourcePool`:

```java
// ArrayBlockingQueue with fair=true prevents thread starvation
this.pool = new ArrayBlockingQueue<>(maxSize, true);

public T acquire(long timeoutMs) throws InterruptedException {
    return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);
}
```

- Queue size is bounded at construction time
- `submit()` returns `false` when full — caller decides to retry, drop, or buffer
- `BoundedResourcePool` uses `ArrayBlockingQueue` which provides blocking acquire with timeout
- `fair=true` ensures FIFO ordering among waiting threads (prevents starvation)

### Test Proof

```java
// Queue capacity = 5, 0 workers (nothing drains)
// 6th submission rejected
assertThat(smallEngine.submit(overflow)).isFalse();

// Resource pool: 50 threads × 100 ops on 5 resources — no leaks
assertThat(pool.available()).isEqualTo(poolSize);
```

---

## Problem 8: Safe Publication of Mutable Objects

### The Problem

When Thread A creates a `Job` and puts it in a queue, Thread B (the worker) might see a partially constructed object — fields set to default values (null, 0) instead of the values Thread A assigned. This is the safe publication problem.

### The Solution — Happens-Before Guarantees from Concurrent Collections

```java
// PriorityBlockingQueue.offer() happens-before PriorityBlockingQueue.poll()
queue.offer(job);  // Thread A
Job job = queue.poll(1, TimeUnit.SECONDS);  // Thread B sees fully constructed job

// ConcurrentHashMap.put() happens-before ConcurrentHashMap.get()
jobRegistry.put(job.getId(), job);
```

- All `java.util.concurrent` collections establish happens-before edges between put and get operations
- This means Thread B is guaranteed to see all writes Thread A made before the `offer()`/`put()`
- Final fields (`id`, `priority`) are safely published by the constructor's happens-before guarantee
- `List.copyOf()` for dependencies creates a defensive immutable copy

---

## Architecture Summary

```
Producers (multiple threads)
    │
    ▼
┌──────────────────────────────────────┐
│  submit(job)                         │
│  ├── Circular dependency check (DFS) │
│  ├── Backpressure check (queue size) │
│  └── PriorityBlockingQueue.offer()   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  PriorityBlockingQueue               │
│  (bounded, thread-safe, priority     │
│   ordered, FIFO within same level)   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Worker Threads (virtual threads)    │
│  ├── poll() from queue               │
│  ├── Check dependencies met          │
│  ├── CAS: PENDING → RUNNING         │
│  ├── Execute with timeout            │
│  ├── CAS: RUNNING → COMPLETED/FAILED│
│  └── Update metrics (LongAdder)      │
└──────────────────────────────────────┘
```

### Concurrency Primitives Used

| Primitive | Where | Why |
|-----------|-------|-----|
| `AtomicReference` + CAS | Job status transitions | Lock-free, prevents double-execution |
| `volatile` | Job timestamps, failure reason | Visibility across threads |
| `LongAdder` | Metrics counters | High-throughput concurrent increments |
| `AtomicLong` | Active job count | Exact point-in-time reads |
| `PriorityBlockingQueue` | Job queue | Thread-safe priority ordering |
| `ArrayBlockingQueue` | Resource pool | Bounded blocking with fairness |
| `ConcurrentHashMap` | Job registry, in-flight tracking | Lock-free concurrent reads/writes |
| `CountDownLatch` | Test synchronization | Wait for N events |
| `ScheduledExecutorService` | Job timeouts | Deferred cancellation |
| Virtual threads | Workers | Lightweight concurrency for I/O-bound jobs |

---

## Wrong vs Right: Common Mistakes

Each problem below shows the naive (broken) approach and the correct solution side by side.

### 1. Race Condition on Status

What is it: A race condition happens when two or more threads access shared data at the same time, and the outcome depends on the unpredictable order of execution. It's called "race" because threads are racing each other to read and write the same memory location. The result is non-deterministic — the program might work 99% of the time and silently corrupt data the other 1%.

```java
// ❌ WRONG — check-then-act is not atomic
if (job.getStatus() == PENDING) {
    job.setStatus(RUNNING);  // another thread can slip in between check and set
}

// ✅ RIGHT — CAS is a single atomic operation
if (job.status.compareAndSet(PENDING, RUNNING)) {
    // guaranteed only one thread enters here
}
```

Why: `if` + `set` is two separate operations. Between them, another thread can read the same value and also enter the block. CAS fuses the check and the write into one CPU instruction.

### 2. Visibility of Writes

What is it: The visibility problem occurs when one thread writes a value to a variable, but other threads continue reading the old (stale) value. This happens because modern CPUs have multiple levels of cache (L1, L2, L3) per core. A write by Core 1 may sit in Core 1's cache and never reach main memory — so Core 2 keeps reading the old value from its own cache. The program appears to "ignore" the write entirely.

```java
// ❌ WRONG — no visibility guarantee
private Instant startedAt;  // Thread B may never see Thread A's write

// ✅ RIGHT — volatile forces flush to main memory
private volatile Instant startedAt;  // Thread B sees the write immediately
```

Why: Without `volatile`, the JVM is free to keep the value in a CPU register or L1 cache indefinitely. `volatile` inserts a memory barrier that forces the write to main memory and invalidates other cores' caches.

### 3. Counter Increment

What is it: The lost update problem happens when multiple threads perform read-modify-write on the same variable. Each thread reads the current value, computes a new value, and writes it back. But if two threads read the same value before either writes, one write overwrites the other — the increment is "lost." At scale, this means your metrics, counters, or balances silently drift from the correct value.

```java
// ❌ WRONG — count++ is read-increment-write (3 ops, not atomic)
private int count;
count++;  // lost updates under concurrency

// ✅ RIGHT — LongAdder stripes across cores
private final LongAdder count = new LongAdder();
count.increment();  // zero lost updates, even under extreme contention
```

Why: `count++` compiles to `ILOAD`, `IADD`, `ISTORE` — three bytecode instructions. Any thread can interleave between them. `LongAdder` uses per-core cells to eliminate contention entirely.

### 4. Unbounded Queue

What is it: The unbounded producer-consumer problem occurs when producers add work to a queue faster than consumers can process it, and the queue has no size limit. The queue grows without bound, consuming more and more heap memory until the JVM throws `OutOfMemoryError` and the entire application crashes. This is especially dangerous because it's a slow-burn failure — the app works fine for hours, then suddenly dies under a traffic spike.

```java
// ❌ WRONG — unbounded queue grows until OOM
private final LinkedList<Job> queue = new LinkedList<>();
queue.add(job);  // never rejects, memory grows forever

// ✅ RIGHT — bounded with rejection
if (queue.size() >= maxQueueSize) return false;  // backpressure
queue.offer(job);
```

Why: Producers can always outpace consumers. Without a bound, the queue absorbs all available heap memory and the JVM crashes. Bounded queues force the producer to slow down or drop work.

### 5. Lock Ordering (Deadlock)

What is it: A deadlock is when two or more threads are permanently blocked, each waiting for a resource the other holds. Thread 1 holds Lock A and waits for Lock B. Thread 2 holds Lock B and waits for Lock A. Neither can proceed — the application hangs forever. Deadlocks are particularly insidious because they don't crash the app or throw exceptions; the threads just silently stop making progress. They're hard to reproduce because they depend on exact timing between threads.

```java
// ❌ WRONG — inconsistent lock order
// Thread 1: lock(A) → lock(B)
// Thread 2: lock(B) → lock(A)  → DEADLOCK

// ✅ RIGHT — always lock in the same order
String first = a.compareTo(b) < 0 ? a : b;
String second = a.compareTo(b) < 0 ? b : a;
lock(first);
lock(second);  // no circular wait possible
```

Why: Deadlock requires a circular wait. If all threads acquire locks in the same global order, the cycle can never form. This is the same technique used in the bank transfer service for account locking.

### 6. Resource Pool Without Timeout

What is it: Thread starvation from resource exhaustion happens when a fixed pool of shared resources (database connections, API clients, file handles) is fully consumed and never returned. Every subsequent thread that tries to acquire a resource blocks indefinitely on `take()`. If the resources are leaked (acquired but never released due to a bug or exception), the entire application freezes — every thread is stuck waiting for a resource that will never come back. Unlike a crash, there's no error message; the app just stops responding.

```java
// ❌ WRONG — blocks forever if pool is exhausted
Resource r = pool.take();  // thread hangs indefinitely

// ✅ RIGHT — timeout prevents thread starvation
Resource r = pool.poll(500, TimeUnit.MILLISECONDS);
if (r == null) {
    // handle exhaustion: retry, fail fast, or degrade
}
```

Why: `take()` blocks the thread until a resource is available. If all resources are leaked (not returned), every thread in the system eventually blocks on `take()` — total deadlock. `poll()` with timeout lets the thread recover.

---

## Interview Quick Reference

| Problem | What It Is | Root Cause | Java Solution | Key Class |
|---------|-----------|-----------|---------------|-----------|
| Double execution | Two threads run the same job because both saw PENDING before either wrote RUNNING | Check-then-act race | CAS (compare-and-swap) | `AtomicReference` |
| Stale reads | Thread B reads an old value that Thread A already updated, because the write is stuck in CPU cache | CPU cache not flushed | Memory barriers | `volatile` |
| Lost increments | Counter shows 6 instead of 7 because two threads read 5, both wrote 6 | Non-atomic read-modify-write | Striped counters | `LongAdder` |
| Priority inversion | Critical alert waits behind 10,000 low-priority jobs in a FIFO queue | FIFO queue ignores priority | Heap-based queue | `PriorityBlockingQueue` |
| Thread starvation | One job runs for 10 minutes, blocking a worker from processing anything else | Long-running jobs hog workers | Timeout + interrupt | `ScheduledExecutorService` |
| Deadlock | Thread 1 holds A, waits for B. Thread 2 holds B, waits for A. Both stuck forever | Circular wait on locks/deps | Consistent ordering / cycle detection | DFS + `ConcurrentHashMap` |
| OOM from queue growth | Queue grows unboundedly during traffic spike until JVM crashes | Unbounded producer-consumer | Bounded queue + rejection | `ArrayBlockingQueue` |
| Partial construction | Worker thread sees a half-initialized Job object (null fields) | Missing happens-before | Safe publication via concurrent collections | `PriorityBlockingQueue` |
| Resource leaks | All DB connections acquired but never returned; every new request blocks forever | Acquire without release | Bounded pool + timeout | `ArrayBlockingQueue` (fair) |
