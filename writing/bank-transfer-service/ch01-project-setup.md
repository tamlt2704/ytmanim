# Chapter 1: Your Second Project — Move Money

[← Series Overview](README.md) | [Chapter 2: A Customer Loses $800 Twice →](ch02-double-spending.md)

---

## The Task

You're two months in. The job engine is running in production. Linus walks over with that look — the one where he's about to ruin your week.

"The payment team needs a transfer service. Account A sends money to Account B. Simple REST API. We'll add Kafka later for scale."

You've heard "simple" before. Last time it took 10 chapters.

"How much money are we talking about?"

Linus shrugs. "Millions of transactions a day. Don't lose any."

He walks away. You open your laptop.

## Initialize the Project

```bash
mkdir bank-transfer-service && cd bank-transfer-service
gradle init --type java-application --dsl groovy --test-framework junit-jupiter
```

```groovy
// build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.5'
    id 'io.spring.dependency-management' version '1.1.6'
}

group = 'com.bank'
version = '1.0.0'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.kafka:spring-kafka'
    runtimeOnly 'org.postgresql:postgresql'
    runtimeOnly 'com.h2database:h2' // for tests

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

You spin up PostgreSQL and Kafka in Docker:

```bash
# PostgreSQL
docker run --rm --name postgres-test -p 5432:5432 \
  -e POSTGRES_DB=bankdb -e POSTGRES_USER=bank -e POSTGRES_PASSWORD=bank123 \
  postgres:16-alpine

# Kafka (KRaft mode, no Zookeeper)
docker run --rm --name kafka-test -p 9092:9092 apache/kafka:3.7.0
```

## The Account Model

First things first — you need accounts that hold money. Bobby Tables (the DBA) has one rule: "Use `BigDecimal` for money. If I see a `double` anywhere near a dollar sign, I'm reverting your PR."

He's right. `0.1 + 0.2 = 0.30000000000000004` in floating-point. In banking, that's a compliance violation.

```java
// src/main/java/com/bank/model/Account.java
package com.bank.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    private String id;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance;

    @Version
    private Long version;

    public Account() {}

    public Account(String id, BigDecimal balance) {
        this.id = id;
        this.balance = balance;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public void debit(BigDecimal amount) {
        if (this.balance.compareTo(amount) < 0) {
            throw new InsufficientFundsException(
                "Account " + id + " has insufficient funds");
        }
        this.balance = this.balance.subtract(amount);
    }

    public void credit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }

    public static class InsufficientFundsException extends RuntimeException {
        public InsufficientFundsException(String message) { super(message); }
    }
}
```

The `@Version` field is for optimistic locking — a safety net we'll appreciate later. The `debit()` method refuses to go negative. No overdrafts.

## The Transfer Request and Status

```java
// src/main/java/com/bank/model/TransferRequest.java
package com.bank.model;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record TransferRequest(
    @NotBlank String idempotencyKey,
    @NotBlank String fromAccountId,
    @NotBlank String toAccountId,
    @NotNull @DecimalMin(value = "0.01") BigDecimal amount
) {}
```

```java
// src/main/java/com/bank/model/TransferStatus.java
package com.bank.model;

public enum TransferStatus {
    PENDING,
    COMPLETED,
    FAILED_INSUFFICIENT_FUNDS,
    FAILED_ACCOUNT_NOT_FOUND,
    FAILED_SAME_ACCOUNT,
    FAILED_INVALID_AMOUNT,
    DUPLICATE
}
```

You notice the `idempotencyKey` field. "What's that for?" you ask Bobby Tables. He gives you a look. "You'll find out in Chapter 4."

## The Naive Transfer Service

You write the simplest thing that works: load both accounts, debit one, credit the other, save.

```java
// src/main/java/com/bank/service/TransferService.java (naive version)
@Service
public class TransferService {

    private final AccountRepository accountRepository;

    @Transactional
    public void executeTransfer(String fromId, String toId, BigDecimal amount) {
        Account from = accountRepository.findById(fromId)
            .orElseThrow(() -> new RuntimeException("Account not found: " + fromId));
        Account to = accountRepository.findById(toId)
            .orElseThrow(() -> new RuntimeException("Account not found: " + toId));

        from.debit(amount);
        to.credit(amount);

        accountRepository.save(from);
        accountRepository.save(to);
    }
}
```

## Smoke Test

You write a quick test. One transfer, single thread.

```java
@Test
void shouldTransferMoney() {
    Account alice = new Account("alice", new BigDecimal("1000.00"));
    Account bob = new Account("bob", new BigDecimal("500.00"));
    accountRepository.saveAll(List.of(alice, bob));

    transferService.executeTransfer("alice", "bob", new BigDecimal("200.00"));

    assertThat(accountRepository.findById("alice").get().getBalance())
        .isEqualByComparingTo("800.00");
    assertThat(accountRepository.findById("bob").get().getBalance())
        .isEqualByComparingTo("700.00");
}
```

Green. Alice had $1000, sent $200 to Bob. Alice now has $800, Bob has $700. Total money in the system: $1500 before, $1500 after. Conservation of money. Physics works.

You show Linus. He nods. "Deploy to staging. Let's see how it handles load."

You deploy. It handles one request at a time beautifully.

Then the load test starts.

---

[← Series Overview](README.md) | [Chapter 2: A Customer Loses $800 Twice →](ch02-double-spending.md)
