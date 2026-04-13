# The Intern Who Built a Job Engine — A Java Concurrency Story

You're an intern at a fintech startup. Day one, your tech lead drops a task on your desk: "We need a background job engine. Jobs come in, engine runs them. How hard can it be?"

You say yes. You have no idea what's coming.

This is the story of how you build a concurrent job processing engine in Java 21, break it in production, and fix every single one. Each chapter is a real incident — a Slack alert at 2 AM, a customer complaint, a postmortem — and the engineering lesson hiding behind it.

**Target audience:** Intermediate Java devs who want to actually understand concurrency, not just memorize "use synchronized."

**Prerequisites:** Java 21, Gradle, basic Java knowledge.

**Final result:** ~300 lines of production code, 26 tests, zero external dependencies (besides Spring Boot for the shell).

---

## The Cast

| Name | Role | Why the nickname |
|------|------|-----------------|
| **Linus** | Tech lead | Reviews every PR like it's a kernel patch |
| **FiveNines** | Ops | Once killed a deploy because availability dropped from 99.999% to 99.998% |
| **TicketMaster** | PM | Creates Jira tickets faster than you can close them. Once filed a bug about a bug report |
| **ZeroTrust** | Security | Trusts nobody. Once rejected his own PR because "the author seems suspicious" |
| **NullPointer** | Data engineer | Every dataset she touches has unexpected nulls. "It's the upstream's fault" |
| **Bobby Tables** | DBA | Named after the [xkcd comic](https://xkcd.com/327/). Accidentally dropped a production table in college. The nickname stuck |

---

## The Story

| Chapter | What Happened | What You Learn | Key Class |
|---------|--------------|----------------|-----------|
| 0 | [Before you start](part-00-prerequisites.md) | Java 21, Gradle setup | — |
| 1 | [Your first day. You build the engine.](part-01-project-setup.md) | Project setup, naive implementation | Gradle, Spring Boot |
| 2 | [A customer gets charged twice.](part-02-race-conditions.md) | Race conditions, check-then-act | `AtomicReference`, CAS |
| 3 | [The dashboard shows jobs stuck at "started."](part-03-visibility.md) | CPU cache visibility | `volatile` |
| 4 | [Metrics say 97,342 jobs. You submitted 100,000.](part-04-lost-increments.md) | Lost increments | `LongAdder`, `AtomicLong` |
| 5 | [A fraud alert waits behind 10,000 log cleanups.](part-05-priority-inversion.md) | Priority inversion | `PriorityBlockingQueue` |
| 6 | [One stuck API call freezes the entire engine.](part-06-thread-starvation.md) | Thread starvation | `ScheduledExecutorService`, timeout |
| 7 | [Two jobs wait for each other forever.](part-07-deadlocks.md) | Deadlocks, circular dependencies | DFS cycle detection |
| 8 | [Black Friday crashes the server.](part-08-backpressure.md) | Backpressure, OOM | Bounded queue + rejection |
| 9 | [All DB connections vanish. App freezes.](part-09-resource-exhaustion.md) | Resource exhaustion | `ArrayBlockingQueue` (fair) |
| 10 | [You ship it. For real this time.](part-10-full-engine.md) | Everything together | `JobEngine` |
| 11 | [The VP wants a real URL by Thursday.](part-11-deployment.md) | Cloud deployment, CI/CD | Docker, GitHub Actions |
| 12 | [Who deleted 12,000 records? Nobody knows.](part-12-database-auth-audit.md) | PostgreSQL persistence, auth, audit trail | JPA, Spring Security, Flyway |
| 13 | [47 jobs in 3 seconds.](part-13-rate-limiting.md) | Rate limiting, token bucket algorithm | CAS, `ConcurrentHashMap`, servlet filters |
| 14 | [A deploy killed 47 running jobs.](part-14-graceful-shutdown.md) | Graceful shutdown, drain period | `@PreDestroy`, health checks, Kubernetes lifecycle |

---

## Final Project Structure

```
src/main/java/com/jobengine/
├── JobEngineApplication.java
├── model/
│   ├── JobStatus.java          (Chapter 1)
│   ├── JobPriority.java        (Chapter 1)
│   └── Job.java                (Chapter 2-3)
├── metrics/
│   └── JobMetrics.java         (Chapter 4)
├── pool/
│   └── BoundedResourcePool.java (Chapter 9)
├── dependency/
│   └── DependencyResolver.java (Chapter 7)
└── engine/
    └── JobEngine.java          (Chapter 10)
```

## Concurrency Primitives Cheat Sheet

| Primitive | Where We Used It | Problem It Solves |
|-----------|-----------------|-------------------|
| `AtomicReference` + CAS | Job status transitions | Race conditions, double-execution |
| `volatile` | Job timestamps, failure reason | Visibility across threads |
| `LongAdder` | Metrics counters | Lost increments under contention |
| `AtomicLong` | Active job count | Exact point-in-time reads |
| `PriorityBlockingQueue` | Job queue | Priority inversion |
| `ArrayBlockingQueue` | Resource pool | Resource exhaustion, starvation |
| `ConcurrentHashMap` | Job registry, in-flight tracking | Lock-free concurrent reads/writes |
| `CountDownLatch` | Test synchronization | Wait for N events |
| `ScheduledExecutorService` | Job timeouts | Thread starvation from long jobs |
| Virtual threads | Workers | Lightweight concurrency |

---

## Posting Guide for Reddit

| Post # | Title for Reddit |
|--------|-----------------|
| 1 | "I'm an intern who built a job engine in Java 21 — here's how it started [Part 1]" |
| 2 | "A customer got charged twice because of my code — race conditions explained [Java 21]" |
| 3 | "The invisible bug: when one thread can't see another thread's write [Java Memory Model]" |
| 4 | "We lost 3,000 metrics in production — why count++ is broken under concurrency [Java]" |
| 5 | "A fraud alert waited behind 10,000 log cleanups — fixing priority inversion [Java 21]" |
| 6 | "One stuck API call froze our entire engine — timeouts saved us [Java concurrency]" |
| 7 | "Two jobs waited for each other forever — how we detect deadlocks with DFS [Java 21]" |
| 8 | "Black Friday crashed our server — backpressure in producer-consumer systems [Java]" |
| 9 | "All our DB connections vanished — resource pools done right [Java concurrency]" |
| 10 | "I shipped a concurrent job engine as an intern — here's the final 300 lines [Java 21]" |
| 11 | "The VP wanted a live demo by Thursday — here's how I deployed a Java 21 engine + React dashboard to the cloud" |
| 12 | "Someone deleted 12,000 records and nobody knew who — adding PostgreSQL, auth, and audit to a Java 21 job engine" |
| 13 | "A stolen token flooded our queue with 47 jobs in 3 seconds — building a lock-free rate limiter with CAS [Java 21]" |
| 14 | "A routine deploy killed 47 running jobs — graceful shutdown in Kubernetes [Java 21]" |

**Tips for Reddit posts:**
- Each post should be self-contained — include the incident, the broken code, the fix, and the test
- Link to the previous post at the top
- Link to the full repo at the bottom
- End each post with a teaser for the next incident
- Cross-post to r/java, r/programming, and r/learnjava
