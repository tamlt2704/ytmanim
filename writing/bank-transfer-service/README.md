# The Intern Who Moved Money — A Java Banking Story

You survived the job engine. Linus was impressed. Now he has a new task: "We need a bank transfer service. Move money between accounts. Don't lose any."

You stare at him. "Don't... lose any?"

"Not a single cent. Also, it needs to handle millions of requests. Also, customers will retry. Also, Kafka. Ship it by end of month."

This is the story of how you build an event-driven bank transfer service in Java 21, accidentally steal money from customers six different ways, and fix every single one. Each chapter is a real incident — a panicked call from compliance, a Slack thread that won't die, a postmortem where you learn what `SELECT ... FOR UPDATE` actually does.

**Target audience:** Java devs who want to understand distributed systems, data integrity, and why fintech is terrifying.

**Prerequisites:** Java 21, Spring Boot, basic SQL. Docker for PostgreSQL and Kafka.

**Final result:** ~400 lines of production code, 23 tests, event-driven architecture with guaranteed data integrity.

---

## The Cast

| Name | Role | Why the nickname |
|------|------|-----------------|
| **Linus** | Tech lead | Reviews every PR like it's a kernel patch |
| **FiveNines** | Ops | Once killed a deploy because availability dropped from 99.999% to 99.998% |
| **TicketMaster** | PM | Creates Jira tickets faster than you can close them |
| **ZeroTrust** | Security | Trusts nobody. Once rejected his own PR because "the author seems suspicious" |
| **NullPointer** | Data engineer | Every dataset she touches has unexpected nulls. "It's the upstream's fault" |
| **Bobby Tables** | DBA | Named after the [xkcd comic](https://xkcd.com/327/). Once dropped a prod table during a demo |

---

## The Story

| Chapter | What Happened | What You Learn | Key Concept |
|---------|--------------|----------------|-------------|
| 1 | [Your second project. Move money.](ch01-project-setup.md) | Project setup, naive transfer | Spring Boot, JPA, BigDecimal |
| 2 | [A customer loses $800 twice.](ch02-double-spending.md) | Double-spending, lost updates | `SELECT FOR UPDATE`, pessimistic locking |
| 3 | [Two transfers deadlock the database.](ch03-deadlocks.md) | Bidirectional deadlocks | Ordered lock acquisition |
| 4 | [A retry charges the customer again.](ch04-idempotency.md) | Duplicate transfers from retries | Idempotency keys, unique DB index |
| 5 | [The database melts on launch day.](ch05-async-kafka.md) | Sync bottleneck at scale | Kafka, async processing, partitioning |
| 6 | [Someone sends $-500 and gets rich.](ch06-validation.md) | Invalid data sneaking through | Multi-layer validation, BigDecimal |
| 7 | [You ship it. Compliance signs off.](ch07-full-service.md) | Everything together | Event-driven architecture |

---

## Architecture

```
Client → POST /sync  → TransferService → DB (immediate)
Client → POST /async → Kafka → Consumer → TransferService → DB (buffered)
Client → GET /{key}  → Status lookup
```

## Book Notes

This series is structured as a standalone book. Each chapter:
- Opens with an incident (the hook)
- Shows the failing code/test (the problem)
- Explains the root cause (the lesson)
- Shows the fix with passing tests (the solution)
- Closes with a story beat that leads to the next chapter

The narrative arc: intern gets a scary project → breaks things in production → learns distributed systems the hard way → ships something solid → earns trust.

For a book format, consider:
- Each chapter = 15-20 pages with code
- Add "War Stories" sidebars with real-world examples from banking/fintech
- Include exercises at the end of each chapter ("What happens if...")
- Appendix: full source code, Docker setup, test suite
- Cover art: the intern staring at a terminal showing a negative bank balance
