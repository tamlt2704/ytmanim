# Breaking Production: A System Design Book

*How one developer broke every system they touched — and learned to build them right.*

You started as an intern who couldn't spell "concurrency." You built a job engine. You moved money. Now you're a senior engineer, and every system you touch teaches you something new about scale, failure, and the art of not losing data.

This book is a collection of system design problems, each told as a story. Each chapter is a different system, a different team, a different disaster. The cast grows. The stakes get higher. The lessons stick because you lived them.

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

## Table of Contents

### Part I: The Fundamentals (You Break Things)

| Ch | System | The Incident | What You Learn |
|----|--------|-------------|----------------|
| 1 | [URL Shortener](ch01-url-shortener.md) | The short URL collides. Two users get the same link. | Hashing, collision handling, base62 encoding, read-heavy caching |
| 2 | [Rate Limiter](ch02-rate-limiter.md) | A bot hammers the API. 10 million requests in 60 seconds. The database dies. | Token bucket, sliding window, Redis, distributed rate limiting |
| 3 | [Key-Value Store](ch03-kv-store.md) | The cache goes down. Every request hits the database. Cascading failure. | Write-ahead log, compaction, consistent hashing, replication |

### Part II: Data at Scale (You Lose Things)

| Ch | System | The Incident | What You Learn |
|----|--------|-------------|----------------|
| 4 | [Message Queue](ch04-message-queue.md) | A message is delivered twice. A customer gets two emails. | At-least-once vs exactly-once, consumer offsets, dead letter queues |
| 5 | [Notification System](ch05-notification-system.md) | 10 million users need a push notification in under 60 seconds. It takes 4 hours. | Fan-out, priority queues, batching, backpressure |
| 6 | [Search Autocomplete](ch06-autocomplete.md) | Users type "ban" and get "banana" instead of "bank transfer." | Trie, prefix matching, ranking, caching hot queries |

### Part III: Distributed Systems (Everything Fails)

| Ch | System | The Incident | What You Learn |
|----|--------|-------------|----------------|
| 7 | [Distributed Cache](ch07-distributed-cache.md) | One cache node dies. 25% of traffic hits the database. Thundering herd. | Consistent hashing, virtual nodes, cache stampede prevention |
| 8 | [Unique ID Generator](ch08-id-generator.md) | Two services generate the same ID. Two orders merge into one. | Snowflake IDs, clock skew, coordination-free generation |
| 9 | [Chat System](ch09-chat-system.md) | Messages arrive out of order. Alice sees Bob's reply before her own message. | WebSockets, message ordering, vector clocks, presence |

### Part IV: The Big Leagues (You Build Real Things)

| Ch | System | The Incident | What You Learn |
|----|--------|-------------|----------------|
| 10 | [News Feed](ch10-news-feed.md) | A celebrity posts. 50 million followers need to see it. The feed service melts. | Fan-out on write vs read, hybrid approach, ranking |
| 11 | [Payment System](ch11-payment-system.md) | A payment succeeds but the confirmation fails. Did the customer pay or not? | Saga pattern, compensating transactions, idempotency |
| 12 | [Monitoring & Alerting](ch12-monitoring.md) | The monitoring system goes down. Nobody notices until a customer tweets about it. | Time-series DB, aggregation, alert fatigue, who watches the watchers |

---

## How to Read This Book

Each chapter follows the same pattern:

1. **The Incident** — something breaks in production (the hook)
2. **The Napkin Design** — you sketch a solution on a napkin (hand-drawn style diagrams)
3. **The Naive Implementation** — you build the obvious thing (it works... until it doesn't)
4. **The Failure** — a test or production incident exposes the flaw
5. **The Real Design** — you fix it with the proper system design (formal diagrams)
6. **The Lesson** — what you learned, summarized as a principle

The chapters are independent — you can read them in any order. But the story flows chronologically: you grow from an intern to a senior engineer across the book.

## Book Production Notes

**Format options:**
- Markdown → PDF via Pandoc with custom LaTeX template
- Markdown → EPUB via Pandoc for e-readers
- Markdown → HTML via mdBook or Docusaurus for web version
- Print: 6x9 trade paperback via Amazon KDP

**Visual style:**
- Story scenes: cartoon SVG (same style as job engine series)
- Architecture diagrams: Mermaid rendered to SVG
- Napkin sketches: hand-drawn style SVG with rough filter
- Code: syntax-highlighted blocks

**Estimated length:** ~300 pages (12 chapters × 25 pages each)

**Revenue model:**
- Free chapters 1-3 on blog/Reddit (marketing funnel)
- Full book on Gumroad / Leanpub ($29-39)
- Print version on Amazon KDP ($39-49)
- Bundle with source code repo ($49-59)
