# Chapter 12: Who Did What, and Where's the Proof?

[← Chapter 11: Ship It to the Cloud](part-11-deployment.md) | [Chapter 13: 47 Jobs in 3 Seconds →](part-13-rate-limiting.md)

---

## The Incident

Friday, 4:47 PM. You're about to close your laptop when Slack pings.

> **@TicketMaster:** A job ran last night that deleted 12,000 customer records. Nobody knows who submitted it. Nobody knows when it started. The logs rotated at midnight and we have nothing.

Silence in the channel. Then:

> **@ZeroTrust:** Who has access to submit jobs? Everyone? EVERYONE?

> **@BobbyTables:** The job data is in-memory. When the pod restarted at 3 AM, every trace of what ran vanished. I have nothing to query.

> **@Linus:** We need three things by Monday. 1) Jobs survive restarts — store them in a database. 2) Users log in before they touch anything. 3) Every action is recorded — who did what, when.

You look at the clock. 4:49 PM on a Friday. You're not an intern anymore, but some things never change.

![ZeroTrust discovers the API has no authentication](images/ch12-zerotrust-open-api.svg)

## Reproducing the Problem

Before you fix anything, you prove it's broken. Three tests. Three failures.

### Test 1: Jobs Vanish on Restart

```java
@Test
void jobsVanishWhenEngineRestarts() throws InterruptedException {
    // Submit 5 jobs to the engine
    JobEngine engine = new JobEngine(4, 1000);
    for (int i = 0; i < 5; i++) {
        engine.submit(new Job("job-" + i, "work-" + i, JobPriority.NORMAL,
                Duration.ofSeconds(5), () -> {}, null));
    }

    // Simulate a pod restart — shut down and create a new engine
    engine.shutdownNow();
    engine.awaitTermination(2, TimeUnit.SECONDS);

    JobEngine newEngine = new JobEngine(4, 1000);

    // How many jobs does the new engine know about?
    assertThat(newEngine.getQueueSize()).isEqualTo(0);  // ZERO. All gone.

    newEngine.shutdownNow();
}
```

Zero. Five jobs submitted, zero recovered. In production, that's five payments that never processed, five reports that never generated, five customers waiting for something that will never come.

### Test 2: Anyone Can Submit

```bash
# No credentials. No token. No identity. Just... a curl.
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"name": "delete-all-customers", "priority": "CRITICAL", "timeoutMs": 5000}'
```

```
HTTP/1.1 200 OK
```

It works. Anyone with the URL can submit a job that deletes your entire customer database. ZeroTrust is going to need a new keyboard after he's done smashing the current one.

### Test 3: Who Did It?

```bash
# After the 12,000-record deletion
grep "delete-all-customers" /var/log/job-engine/*.log
```

```
(no results — logs rotated at midnight)
```

No database record. No audit trail. No logs. The job existed only in memory, and memory doesn't survive a restart.

Three problems. Three fixes. Let's go.

## The Problem

Right now the job engine has three gaps that would make any auditor faint:

1. **No persistence.** Jobs live in a `PriorityBlockingQueue` in memory. Pod restarts, OOM kills, deploys — everything is gone. Bobby Tables can't query what doesn't exist.

2. **No authentication.** The REST API is wide open. Anyone with the URL can submit, cancel, or delete jobs. ZeroTrust is right to be furious.

3. **No audit trail.** When something goes wrong — and it will — there's no record of who submitted a job, who cancelled it, or who changed its priority. The 12,000-record deletion is a ghost.

Time to fix all three.

## Step 1: Add PostgreSQL

### Dependencies

Add Spring Data JPA, PostgreSQL driver, and Flyway for schema migrations:

```groovy
// build.gradle — add to dependencies
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'       // ← new
    implementation 'org.springframework.boot:spring-boot-starter-security'       // ← new (Step 2)
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'                             // ← new (JWT)
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.6'                              // ← new (JWT)
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.6'                           // ← new (JWT)
    implementation 'org.flywaydb:flyway-core'                                    // ← new
    implementation 'org.flywaydb:flyway-database-postgresql'                     // ← new

    runtimeOnly 'org.postgresql:postgresql'                                      // ← new

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'       // ← new
    testImplementation 'org.testcontainers:postgresql:1.20.4'                    // ← new (tests)
    testImplementation 'org.testcontainers:junit-jupiter:1.20.4'                 // ← new (tests)
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```

### Configuration

```yaml
# src/main/resources/application.yml
spring:
  application:
    name: job-engine
  threads:
    virtual:
      enabled: true
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/jobengine}
    username: ${DATABASE_USER:jobengine}
    password: ${DATABASE_PASSWORD:jobengine}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
      connection-timeout: 5000    # Bobby Tables approved — no infinite waits
  jpa:
    hibernate:
      ddl-auto: validate           # Flyway manages the schema, Hibernate only validates
    open-in-view: false            # No lazy-loading surprises in controllers
  flyway:
    enabled: true
    locations: classpath:db/migration

management:
  endpoints:
    web:
      exposure:
        include: health
  endpoint:
    health:
      show-details: never

server:
  port: ${PORT:8080}

app:
  jwt:
    secret: ${JWT_SECRET:your-256-bit-secret-change-this-in-production-please}
    expiration-ms: ${JWT_EXPIRATION:3600000}   # 1 hour
```

> **@ZeroTrust:** That `JWT_SECRET` comes from an environment variable in production. If I find it hardcoded in a commit, I'm rotating every key in the company.

> **@BobbyTables:** `ddl-auto: validate`. Good. If I ever see `update` or `create-drop` in production, I'm dropping your access instead.

### Schema Migration — V1

Flyway runs numbered SQL files in order. You never edit a migration after it's deployed — you write a new one.

```sql
-- src/main/resources/db/migration/V1__create_job_tables.sql

-- Users who can interact with the engine
CREATE TABLE app_user (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'OPERATOR',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Persisted job records
CREATE TABLE job_record (
    id             VARCHAR(36)  PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    priority       VARCHAR(20)  NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    submitted_by   BIGINT       REFERENCES app_user(id),
    submitted_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    started_at     TIMESTAMP,
    completed_at   TIMESTAMP,
    failure_reason TEXT,
    timeout_ms     BIGINT
);

CREATE INDEX idx_job_record_status ON job_record(status);
CREATE INDEX idx_job_record_submitted_by ON job_record(submitted_by);
CREATE INDEX idx_job_record_submitted_at ON job_record(submitted_at DESC);

-- Audit log — append-only, never deleted
CREATE TABLE audit_log (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       REFERENCES app_user(id),
    username    VARCHAR(50)  NOT NULL,
    action      VARCHAR(50)  NOT NULL,
    target_type VARCHAR(50)  NOT NULL,
    target_id   VARCHAR(255),
    detail      TEXT,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
```

Three tables. `app_user` for authentication. `job_record` for persistence. `audit_log` for "who did what." The audit log is append-only — ZeroTrust's golden rule.

> **@ZeroTrust:** If anyone adds a DELETE endpoint for the audit log, I'm revoking their badge AND their GitHub access.

## Step 2: The JPA Entities

### JobRecord — The Persistent Job

The in-memory `Job` class from Chapter 2 still handles the concurrency (CAS, volatile). `JobRecord` is its database mirror — what gets saved and queried.

```java
// src/main/java/com/jobengine/persistence/entity/JobRecord.java
package com.jobengine.persistence.entity;

import com.jobengine.model.JobPriority;
import com.jobengine.model.JobStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "job_record")
public class JobRecord {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @Column(name = "submitted_by")
    private Long submittedBy;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "timeout_ms")
    private Long timeoutMs;

    protected JobRecord() {} // JPA

    public JobRecord(String id, String name, JobPriority priority,
                     Long submittedBy, Long timeoutMs) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.status = JobStatus.PENDING;
        this.submittedBy = submittedBy;
        this.submittedAt = Instant.now();
        this.timeoutMs = timeoutMs;
    }

    // Getters and setters
    public String getId() { return id; }
    public String getName() { return name; }
    public JobPriority getPriority() { return priority; }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
    public Long getSubmittedBy() { return submittedBy; }
    public Instant getSubmittedAt() { return submittedAt; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant t) { this.startedAt = t; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant t) { this.completedAt = t; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String r) { this.failureReason = r; }
    public Long getTimeoutMs() { return timeoutMs; }
}
```

### AppUser — Who's Logged In

```java
// src/main/java/com/jobengine/persistence/entity/AppUser.java
package com.jobengine.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected AppUser() {} // JPA

    public AppUser(String username, String passwordHash, String role) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
}
```

### AuditLog — The Immutable Record

```java
// src/main/java/com/jobengine/persistence/entity/AuditLog.java
package com.jobengine.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;

    @Column(name = "target_id")
    private String targetId;

    private String detail;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected AuditLog() {} // JPA

    public AuditLog(Long userId, String username, String action,
                    String targetType, String targetId,
                    String detail, String ipAddress) {
        this.userId = userId;
        this.username = username;
        this.action = action;
        this.targetType = targetType;
        this.targetId = targetId;
        this.detail = detail;
        this.ipAddress = ipAddress;
    }

    // Getters — no setters. Audit logs are immutable.
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getAction() { return action; }
    public String getTargetType() { return targetType; }
    public String getTargetId() { return targetId; }
    public String getDetail() { return detail; }
    public String getIpAddress() { return ipAddress; }
    public Instant getCreatedAt() { return createdAt; }
}
```

No setters on `AuditLog`. Once written, it's permanent. ZeroTrust's second golden rule.

## Step 3: Repositories

```java
// src/main/java/com/jobengine/persistence/repository/JobRecordRepository.java
package com.jobengine.persistence.repository;

import com.jobengine.model.JobStatus;
import com.jobengine.persistence.entity.JobRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRecordRepository extends JpaRepository<JobRecord, String> {
    List<JobRecord> findByStatusOrderBySubmittedAtDesc(JobStatus status);
    List<JobRecord> findBySubmittedByOrderBySubmittedAtDesc(Long userId);
}
```

```java
// src/main/java/com/jobengine/persistence/repository/AppUserRepository.java
package com.jobengine.persistence.repository;

import com.jobengine.persistence.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
}
```

```java
// src/main/java/com/jobengine/persistence/repository/AuditLogRepository.java
package com.jobengine.persistence.repository;

import com.jobengine.persistence.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTargetIdOrderByCreatedAtDesc(String targetId);
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AuditLog> findTop100ByOrderByCreatedAtDesc();
}
```


## Step 4: Authentication — Spring Security

### Roles

Three roles. Simple hierarchy.

| Role | Can Do |
|------|--------|
| `VIEWER` | View jobs, view metrics |
| `OPERATOR` | Everything VIEWER can + submit, cancel jobs |
| `ADMIN` | Everything OPERATOR can + manage users, view audit logs |

```java
// src/main/java/com/jobengine/security/Role.java
package com.jobengine.security;

public enum Role {
    VIEWER, OPERATOR, ADMIN
}
```

### UserDetailsService — Load Users from PostgreSQL

```java
// src/main/java/com/jobengine/security/DatabaseUserDetailsService.java
package com.jobengine.security;

import com.jobengine.persistence.entity.AppUser;
import com.jobengine.persistence.repository.AppUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    public DatabaseUserDetailsService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found: " + username));

        return new User(
                user.getUsername(),
                user.getPasswordHash(),
                user.isEnabled(), true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
```

### Security Configuration

```java
// src/main/java/com/jobengine/security/SecurityConfig.java
package com.jobengine.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Stateless API — no CSRF needed
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/auth/**").permitAll()  // login endpoint — no token needed
                .requestMatchers(HttpMethod.GET, "/api/jobs/**").hasAnyRole("VIEWER", "OPERATOR", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/metrics/**").hasAnyRole("VIEWER", "OPERATOR", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/jobs/**").hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/**").hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/audit/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

No session. No cookies. No HTTP Basic. Every request carries a JWT in the `Authorization` header. The `JwtAuthFilter` intercepts it, validates it, and sets the `SecurityContext`. Stateless from top to bottom.

### JwtService — Sign and Verify Tokens

This is where the cryptography lives. HMAC-SHA256 signs the token. The secret key comes from the environment — never hardcoded.

```java
// src/main/java/com/jobengine/security/JwtService.java
package com.jobengine.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("role", userDetails.getAuthorities().iterator().next().getAuthority())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isValid(String token, UserDetails userDetails) {
        Claims claims = extractClaims(token);
        boolean notExpired = claims.getExpiration().after(new Date());
        boolean usernameMatches = claims.getSubject().equals(userDetails.getUsername());
        return notExpired && usernameMatches;
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

The token contains three things: the username (`sub`), the role (`role`), and the expiration. That's it. No session state on the server. The token IS the session.

### JwtAuthFilter — Intercept Every Request

```java
// src/main/java/com/jobengine/security/JwtAuthFilter.java
package com.jobengine.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DatabaseUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService,
                         DatabaseUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);  // strip "Bearer "

        try {
            String username = jwtService.extractUsername(token);

            if (username != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isValid(token, userDetails)) {
                    var authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Invalid token — don't set auth, let Spring Security reject it
        }

        filterChain.doFilter(request, response);
    }
}
```

The flow: extract the `Bearer` token → parse it → load the user from PostgreSQL → validate the signature and expiration → set the `SecurityContext`. If anything fails, the request continues without authentication and Spring Security returns 401.

### AuthController — The Login Endpoint

Users POST their credentials to `/api/auth/login` and get a JWT back. That token goes in the `Authorization` header for every subsequent request.

```java
// src/main/java/com/jobengine/controller/AuthController.java
package com.jobengine.controller;

import com.jobengine.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    record LoginRequest(@NotBlank String username, @NotBlank String password) {}
    record LoginResponse(String token, String username, String role) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password()));

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return ResponseEntity.ok(new LoginResponse(token, userDetails.getUsername(), role));
    }
}
```

> **@ZeroTrust:** Stateless. No session to hijack. Token expires in 1 hour. I can live with this.

## Step 5: The Audit Service — Who Did What

This is the core of the audit trail. Every action goes through here. No exceptions.

```java
// src/main/java/com/jobengine/audit/AuditService.java
package com.jobengine.audit;

import com.jobengine.persistence.entity.AuditLog;
import com.jobengine.persistence.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Record an action. This is append-only — no updates, no deletes.
     */
    public void record(Long userId, String username, String action,
                       String targetType, String targetId,
                       String detail, String ipAddress) {
        AuditLog entry = new AuditLog(
                userId, username, action, targetType, targetId, detail, ipAddress);
        auditLogRepository.save(entry);
        log.info("AUDIT: user={} action={} target={}/{} detail={}",
                username, action, targetType, targetId, detail);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getLogsByUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<AuditLog> getLogsByTarget(String targetId) {
        return auditLogRepository.findByTargetIdOrderByCreatedAtDesc(targetId);
    }
}
```

The `log.info` line is intentional — audit events go to both the database AND the application log. If the database is down, you still have the log file. Belt and suspenders.

## Step 6: The Persistent Job Service

This service bridges the in-memory engine (fast, concurrent) with the database (durable, queryable). When a job is submitted, it's saved to PostgreSQL AND queued in memory. When the status changes, the database record is updated.

```java
// src/main/java/com/jobengine/service/PersistentJobService.java
package com.jobengine.service;

import com.jobengine.audit.AuditService;
import com.jobengine.engine.JobEngine;
import com.jobengine.model.Job;
import com.jobengine.model.JobPriority;
import com.jobengine.model.JobStatus;
import com.jobengine.persistence.entity.AppUser;
import com.jobengine.persistence.entity.JobRecord;
import com.jobengine.persistence.repository.AppUserRepository;
import com.jobengine.persistence.repository.JobRecordRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class PersistentJobService {

    private final JobEngine engine;
    private final JobRecordRepository jobRecordRepository;
    private final AppUserRepository userRepository;
    private final AuditService auditService;

    public PersistentJobService(JobEngine engine,
                                JobRecordRepository jobRecordRepository,
                                AppUserRepository userRepository,
                                AuditService auditService) {
        this.engine = engine;
        this.jobRecordRepository = jobRecordRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public JobRecord submitJob(String name, JobPriority priority,
                               long timeoutMs, Runnable task,
                               Authentication auth, String ipAddress) {
        AppUser user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String jobId = UUID.randomUUID().toString();

        // 1. Save to database FIRST — survives restarts
        JobRecord record = new JobRecord(jobId, name, priority,
                user.getId(), timeoutMs);
        jobRecordRepository.save(record);

        // 2. Create in-memory job with a callback that updates the DB
        Job job = new Job(jobId, name, priority, Duration.ofMillis(timeoutMs),
                wrapWithPersistence(jobId, task), null);

        // 3. Submit to the concurrent engine
        boolean accepted = engine.submit(job);
        if (!accepted) {
            record.setStatus(JobStatus.FAILED);
            record.setFailureReason("Rejected by engine (queue full or circular dependency)");
            jobRecordRepository.save(record);
        }

        // 4. Audit
        auditService.record(user.getId(), user.getUsername(),
                "JOB_SUBMITTED", "JOB", jobId,
                "name=" + name + " priority=" + priority,
                ipAddress);

        return record;
    }

    @Transactional
    public boolean cancelJob(String jobId, Authentication auth, String ipAddress) {
        AppUser user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        boolean cancelled = engine.cancel(jobId);

        if (cancelled) {
            jobRecordRepository.findById(jobId).ifPresent(record -> {
                record.setStatus(JobStatus.CANCELLED);
                jobRecordRepository.save(record);
            });

            auditService.record(user.getId(), user.getUsername(),
                    "JOB_CANCELLED", "JOB", jobId, null, ipAddress);
        }

        return cancelled;
    }

    /**
     * Wrap the original task so status changes are persisted to the database.
     * The in-memory CAS still handles concurrency — this just mirrors to PostgreSQL.
     */
    private Runnable wrapWithPersistence(String jobId, Runnable originalTask) {
        return () -> {
            // Update DB: RUNNING
            jobRecordRepository.findById(jobId).ifPresent(record -> {
                record.setStatus(JobStatus.RUNNING);
                record.setStartedAt(java.time.Instant.now());
                jobRecordRepository.save(record);
            });

            try {
                originalTask.run();

                // Update DB: COMPLETED
                jobRecordRepository.findById(jobId).ifPresent(record -> {
                    record.setStatus(JobStatus.COMPLETED);
                    record.setCompletedAt(java.time.Instant.now());
                    jobRecordRepository.save(record);
                });
            } catch (Exception e) {
                // Update DB: FAILED
                jobRecordRepository.findById(jobId).ifPresent(record -> {
                    record.setStatus(JobStatus.FAILED);
                    record.setFailureReason(e.getMessage());
                    record.setCompletedAt(java.time.Instant.now());
                    jobRecordRepository.save(record);
                });
                throw e;  // re-throw so the engine's error handling still works
            }
        };
    }

    public List<JobRecord> getJobsByStatus(JobStatus status) {
        return jobRecordRepository.findByStatusOrderBySubmittedAtDesc(status);
    }

    public List<JobRecord> getJobsByUser(Long userId) {
        return jobRecordRepository.findBySubmittedByOrderBySubmittedAtDesc(userId);
    }

    public List<JobRecord> getAllJobs() {
        return jobRecordRepository.findAll();
    }
}
```

The key insight: the in-memory engine is still the source of truth for concurrency (CAS transitions, priority ordering, backpressure). PostgreSQL is the source of truth for history. They work together — the engine is fast, the database is durable.

### The @Transactional Trap

Notice that `wrapWithPersistence` runs inside a virtual thread worker — outside of Spring's request lifecycle. The `@Transactional` annotation on `submitJob` doesn't cover it. Each `findById` + `save` inside the wrapper is its own transaction, auto-committed by Spring Data JPA's default behavior.

This is actually fine here. Each status update is independent — if the job fails after transitioning to RUNNING, you want the RUNNING write to be committed already so the FAILED write can happen separately. If you wrapped the entire execution in one transaction, a failure would roll back the RUNNING status too, and you'd lose the evidence that the job ever started.

> **@BobbyTables:** One transaction per status change. If the app crashes between RUNNING and COMPLETED, I can query for orphaned RUNNING jobs and investigate. If you'd wrapped it all in one transaction, I'd see nothing.

### Startup Recovery — Don't Lose Orphans

The whole incident started because a pod restart lost everything. You persist jobs now, but what about jobs that were PENDING or RUNNING when the pod died? They're in the database with a stale status. Nobody's going to pick them up unless you look.

```java
// src/main/java/com/jobengine/service/StartupRecoveryService.java
package com.jobengine.service;

import com.jobengine.model.JobStatus;
import com.jobengine.persistence.entity.JobRecord;
import com.jobengine.persistence.repository.JobRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class StartupRecoveryService {

    private static final Logger log = LoggerFactory.getLogger(StartupRecoveryService.class);

    private final JobRecordRepository jobRecordRepository;

    public StartupRecoveryService(JobRecordRepository jobRecordRepository) {
        this.jobRecordRepository = jobRecordRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void recoverOrphanedJobs() {
        // Jobs that were RUNNING when the pod died — mark them FAILED
        List<JobRecord> orphanedRunning =
                jobRecordRepository.findByStatusOrderBySubmittedAtDesc(JobStatus.RUNNING);

        for (JobRecord record : orphanedRunning) {
            record.setStatus(JobStatus.FAILED);
            record.setFailureReason("Orphaned — pod restarted while job was running");
            record.setCompletedAt(Instant.now());
            jobRecordRepository.save(record);
            log.warn("RECOVERY: Marked orphaned RUNNING job {} as FAILED", record.getId());
        }

        // Jobs that were PENDING — mark them FAILED too
        // (the in-memory queue is gone, these can't be re-queued without the original task)
        List<JobRecord> orphanedPending =
                jobRecordRepository.findByStatusOrderBySubmittedAtDesc(JobStatus.PENDING);

        for (JobRecord record : orphanedPending) {
            record.setStatus(JobStatus.FAILED);
            record.setFailureReason("Orphaned — pod restarted before job could execute");
            record.setCompletedAt(Instant.now());
            jobRecordRepository.save(record);
            log.warn("RECOVERY: Marked orphaned PENDING job {} as FAILED", record.getId());
        }

        int total = orphanedRunning.size() + orphanedPending.size();
        if (total > 0) {
            log.info("RECOVERY: Cleaned up {} orphaned jobs on startup", total);
        }
    }
}
```

Why mark them FAILED instead of re-queuing? Because the `Runnable` task is gone. It lived in memory. You have the job metadata (name, priority, who submitted it) but not the actual work. The right thing to do is mark them FAILED with a clear reason, so operators can resubmit if needed.

> **@FiveNines:** "Orphaned — pod restarted while job was running." That's a failure reason I can alert on. Set up a Grafana panel for it.


## Step 7: The REST API — Now with Auth and Audit

```java
// src/main/java/com/jobengine/controller/JobController.java
package com.jobengine.controller;

import com.jobengine.model.JobPriority;
import com.jobengine.model.JobStatus;
import com.jobengine.persistence.entity.JobRecord;
import com.jobengine.service.PersistentJobService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final PersistentJobService jobService;

    public JobController(PersistentJobService jobService) {
        this.jobService = jobService;
    }

    record SubmitRequest(
            @NotBlank String name,
            @NotNull JobPriority priority,
            long timeoutMs
    ) {}

    @PostMapping
    public ResponseEntity<JobRecord> submit(@Valid @RequestBody SubmitRequest req,
                                            Authentication auth,
                                            HttpServletRequest httpReq) {
        // The actual task would come from a task registry in production.
        // For now, a placeholder that simulates work.
        Runnable task = () -> {
            try { Thread.sleep(100); }
            catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        };

        JobRecord record = jobService.submitJob(
                req.name(), req.priority(), req.timeoutMs(),
                task, auth, httpReq.getRemoteAddr());

        return ResponseEntity.ok(record);
    }

    @PostMapping("/{jobId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable String jobId,
                                       Authentication auth,
                                       HttpServletRequest httpReq) {
        boolean cancelled = jobService.cancelJob(jobId, auth, httpReq.getRemoteAddr());
        return cancelled ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<JobRecord> listAll() {
        return jobService.getAllJobs();
    }

    @GetMapping(params = "status")
    public List<JobRecord> listByStatus(@RequestParam JobStatus status) {
        return jobService.getJobsByStatus(status);
    }
}
```

### Audit Log Endpoint — Admin Only

```java
// src/main/java/com/jobengine/controller/AuditController.java
package com.jobengine.controller;

import com.jobengine.audit.AuditService;
import com.jobengine.persistence.entity.AuditLog;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public List<AuditLog> getRecentLogs() {
        return auditService.getRecentLogs();
    }

    @GetMapping("/user/{userId}")
    public List<AuditLog> getLogsByUser(@PathVariable Long userId) {
        return auditService.getLogsByUser(userId);
    }

    @GetMapping("/target/{targetId}")
    public List<AuditLog> getLogsByTarget(@PathVariable String targetId) {
        return auditService.getLogsByTarget(targetId);
    }
}
```

Notice: no `DELETE` or `PUT` on the audit controller. Read-only. ZeroTrust insisted.

## Step 8: Seed Data Migration

You need at least one admin user to bootstrap the system. A second Flyway migration handles this.

```sql
-- src/main/resources/db/migration/V2__seed_users.sql

-- Passwords hashed with BCrypt (cost factor 10)
-- In production, change these immediately after first login.

-- admin / admin123
INSERT INTO app_user (username, password_hash, role, enabled)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', true);

-- operator / operator123
INSERT INTO app_user (username, password_hash, role, enabled)
VALUES ('operator', '$2a$10$dXJ3SW6G7P50lGmMQgel6uVktDQd36INhd4kL0pPIqFKCzYV9sOHC', 'OPERATOR', true);

-- viewer / viewer123
INSERT INTO app_user (username, password_hash, role, enabled)
VALUES ('viewer', '$2a$10$EqKcp1WFKAr4GAIKOK8.GOoIEEbzXKzYqAlGMl1jJUBGmLTnSP.Hu', 'VIEWER', true);
```

> **@ZeroTrust:** Those default passwords get changed in the first 60 seconds or I'm shutting down the pod. All three of them.

## Step 9: Docker Compose — Local Development

You need PostgreSQL running locally. Docker Compose makes it painless.

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: jobengine
      POSTGRES_USER: jobengine
      POSTGRES_PASSWORD: jobengine
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d
./gradlew bootRun
```

Flyway runs the migrations on startup. The tables are created. The admin user exists. You're live.

## Step 10: Test It

### Login — Get a Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJS...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

Save that token. Every request from now on carries it.

```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9..."
```

### Submit a Job (as OPERATOR)

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "generate-report", "priority": "HIGH", "timeoutMs": 30000}'
```

Response:

```json
{
  "id": "a1b2c3d4-...",
  "name": "generate-report",
  "priority": "HIGH",
  "status": "PENDING",
  "submittedBy": 2,
  "submittedAt": "2026-04-13T10:30:00Z"
}
```

### Check the Audit Log (as ADMIN)

```bash
curl http://localhost:8080/api/audit \
  -H "Authorization: Bearer $TOKEN"
```

```json
[
  {
    "id": 1,
    "userId": 2,
    "username": "operator",
    "action": "JOB_SUBMITTED",
    "targetType": "JOB",
    "targetId": "a1b2c3d4-...",
    "detail": "name=generate-report priority=HIGH",
    "ipAddress": "127.0.0.1",
    "createdAt": "2026-04-13T10:30:00Z"
  }
]
```

### Try Without a Token

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"name": "sneaky-job", "priority": "LOW", "timeoutMs": 5000}'
```

```
HTTP/1.1 401 Unauthorized
```

### Try With an Expired or Tampered Token

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.TAMPERED.invalid" \
  -d '{"name": "hacked-job", "priority": "LOW", "timeoutMs": 5000}'
```

```
HTTP/1.1 401 Unauthorized
```

The signature check fails. The token was tampered with. No entry.

### Try as VIEWER (No Submit Permission)

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -d '{"name": "not-allowed", "priority": "LOW", "timeoutMs": 5000}'
```

```
HTTP/1.1 403 Forbidden
```

ZeroTrust checks the audit log. Every action is there. Every user is identified. Every IP is recorded.

> **@ZeroTrust:** Acceptable. For now.

## The Architecture — Updated

```
┌──────────────────────────────────────────────────────────────┐
│  Client (curl / dashboard / API consumer)                    │
│  ├── POST /api/auth/login → get JWT                          │
│  └── Authorization: Bearer <token> on every request          │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  JwtAuthFilter                                               │
│  ├── Extract Bearer token from header                        │
│  ├── Verify HMAC-SHA256 signature                            │
│  ├── Check expiration                                        │
│  └── Set SecurityContext (username + role)                    │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  Spring Security Authorization                               │
│  ├── VIEWER → GET only                                       │
│  ├── OPERATOR → GET + POST (submit, cancel)                  │
│  ├── ADMIN → everything + audit logs                         │
│  └── Reject 401 (no token) or 403 (wrong role)              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  PersistentJobService                                        │
│  ├── Save JobRecord to PostgreSQL (durable)                  │
│  ├── Submit to in-memory JobEngine (fast, concurrent)        │
│  ├── Record AuditLog entry (who, what, when, from where)     │
│  └── Wrap task with DB status callbacks                      │
└──────────┬──────────────────────┬────────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────────┐  ┌────────────────────────────────────┐
│  PostgreSQL          │  │  In-Memory JobEngine (Ch 2-10)     │
│  ├── job_record      │  │  ├── PriorityBlockingQueue         │
│  ├── app_user        │  │  ├── CAS transitions               │
│  └── audit_log       │  │  ├── Virtual thread workers        │
│                      │  │  └── Backpressure + timeouts       │
│  Source of truth:    │  │                                    │
│  HISTORY             │  │  Source of truth: CONCURRENCY      │
└─────────────────────┘  └────────────────────────────────────┘
```

## What We Added

| Component | What It Does | Why |
|-----------|-------------|-----|
| `job_record` table | Persists job status, timestamps, who submitted | Jobs survive restarts. Bobby Tables can query them. |
| `app_user` table | Stores users with BCrypt passwords and roles | ZeroTrust can sleep at night. |
| `audit_log` table | Append-only record of every action | "Who deleted 12,000 records?" Now you can answer that. |
| `JwtService` | Signs and verifies HMAC-SHA256 tokens | Stateless auth. No session to hijack. Token expires in 1 hour. |
| `JwtAuthFilter` | Intercepts every request, validates the Bearer token | The gateway. No valid token, no entry. |
| `AuthController` | `/api/auth/login` — exchange credentials for a JWT | One login, then tokens for everything else. |
| `StartupRecoveryService` | Marks orphaned PENDING/RUNNING jobs as FAILED on boot | Pod restarts don't leave ghost jobs. FiveNines can alert on it. |
| Spring Security | JWT + role-based access control | VIEWERs can't submit. OPERATORs can't view audit logs. |
| Flyway migrations | Versioned, repeatable schema changes | Bobby Tables won't let you `ddl-auto: update` in production. |
| `PersistentJobService` | Bridges the in-memory engine with PostgreSQL | Fast concurrency AND durable history. |
| Testcontainers | Real PostgreSQL in tests — no mocking | 13 integration tests prove everything works end-to-end. |

## Bobby Tables' Query

Monday morning. Bobby Tables runs the query that was impossible last Friday:

```sql
SELECT
    al.username,
    al.action,
    al.target_id,
    al.detail,
    al.ip_address,
    al.created_at
FROM audit_log al
WHERE al.action = 'JOB_SUBMITTED'
  AND al.created_at >= NOW() - INTERVAL '7 days'
ORDER BY al.created_at DESC;
```

He finds it. The job that deleted 12,000 records was submitted by a service account at 2:17 AM from an IP address that belongs to a CI pipeline nobody knew was still running.

> **@BobbyTables:** Found it. Orphaned CI pipeline, service account `deploy-bot`, submitted a cleanup job with no safeguards. I can see the exact timestamp, the IP, and the user. This is what a proper audit trail looks like.

> **@Linus:** Good. Now disable that service account and add a confirmation step for destructive jobs. PR by end of day.

## The Tests That Prove the Fix

Every chapter has tests. This one's no different — except now you need a real PostgreSQL database to test against. Testcontainers spins up a throwaway PostgreSQL in Docker for each test run. No mocking. Real SQL. Real constraints.

Add the test dependency:

```groovy
// build.gradle — add to test dependencies
testImplementation 'org.testcontainers:postgresql:1.20.4'
testImplementation 'org.testcontainers:junit-jupiter:1.20.4'
```

### Base Test Class — Shared PostgreSQL Container

```java
// src/test/java/com/jobengine/IntegrationTestBase.java
package com.jobengine;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public abstract class IntegrationTestBase {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("jobengine_test")
                    .withUsername("test")
                    .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("app.jwt.secret",
                () -> "test-secret-that-is-at-least-256-bits-long-for-hmac-sha256");
        registry.add("app.jwt.expiration-ms", () -> "3600000");
    }
}
```

One PostgreSQL container, shared across all test classes. Flyway runs the migrations automatically. The test database starts clean every time.

### Test: Authentication and Authorization

```java
// src/test/java/com/jobengine/security/AuthIntegrationTest.java
package com.jobengine.security;

import com.jobengine.IntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
class AuthIntegrationTest extends IntegrationTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldLoginAndGetToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"username": "admin", "password": "admin123"}
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }

    @Test
    void shouldRejectBadCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"username": "admin", "password": "wrong"}
                            """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectViewerSubmittingJob() throws Exception {
        String viewerToken = login("viewer", "viewer123");

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + viewerToken)
                        .content("""
                            {"name": "not-allowed", "priority": "LOW", "timeoutMs": 5000}
                            """))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowOperatorToSubmitJob() throws Exception {
        String operatorToken = login("operator", "operator123");

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + operatorToken)
                        .content("""
                            {"name": "allowed-job", "priority": "HIGH", "timeoutMs": 30000}
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("allowed-job"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldBlockViewerFromAuditLogs() throws Exception {
        String viewerToken = login("viewer", "viewer123");

        mockMvc.perform(get("/api/audit")
                        .header("Authorization", "Bearer " + viewerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowAdminToViewAuditLogs() throws Exception {
        String adminToken = login("admin", "admin123");

        mockMvc.perform(get("/api/audit")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    private String login(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format(
                                """
                                {"username": "%s", "password": "%s"}
                                """, username, password)))
                .andExpect(status().isOk())
                .andReturn();

        // Extract token from JSON response
        String body = result.getResponse().getContentAsString();
        return body.split("\"token\":\"")[1].split("\"")[0];
    }
}
```

Seven tests. Login works. Bad credentials rejected. No token → 401. Wrong role → 403. Right role → 200. Audit logs locked to ADMIN only.

### Test: Job Persistence and Audit Trail

```java
// src/test/java/com/jobengine/persistence/JobPersistenceIntegrationTest.java
package com.jobengine.persistence;

import com.jobengine.IntegrationTestBase;
import com.jobengine.model.JobStatus;
import com.jobengine.persistence.entity.JobRecord;
import com.jobengine.persistence.repository.AuditLogRepository;
import com.jobengine.persistence.repository.JobRecordRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
class JobPersistenceIntegrationTest extends IntegrationTestBase {

    @Autowired private MockMvc mockMvc;
    @Autowired private JobRecordRepository jobRecordRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    @Test
    void submittedJobShouldBePersisted() throws Exception {
        String token = login("operator", "operator123");

        MvcResult result = mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content("""
                            {"name": "persist-test", "priority": "HIGH", "timeoutMs": 30000}
                            """))
                .andExpect(status().isOk())
                .andReturn();

        // Extract job ID from response
        String body = result.getResponse().getContentAsString();
        String jobId = body.split("\"id\":\"")[1].split("\"")[0];

        // Verify it's in the database
        Optional<JobRecord> record = jobRecordRepository.findById(jobId);
        assertThat(record).isPresent();
        assertThat(record.get().getName()).isEqualTo("persist-test");
        assertThat(record.get().getSubmittedBy()).isNotNull();
    }

    @Test
    void submittedJobShouldCreateAuditEntry() throws Exception {
        long auditCountBefore = auditLogRepository.count();
        String token = login("operator", "operator123");

        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content("""
                            {"name": "audit-test", "priority": "NORMAL", "timeoutMs": 5000}
                            """))
                .andExpect(status().isOk());

        // Verify audit log was created
        long auditCountAfter = auditLogRepository.count();
        assertThat(auditCountAfter).isGreaterThan(auditCountBefore);

        var recentLogs = auditLogRepository.findTop100ByOrderByCreatedAtDesc();
        assertThat(recentLogs.get(0).getAction()).isEqualTo("JOB_SUBMITTED");
        assertThat(recentLogs.get(0).getUsername()).isEqualTo("operator");
    }

    @Test
    void jobsShouldSurviveQueryAfterCreation() throws Exception {
        String token = login("operator", "operator123");

        // Submit a job
        mockMvc.perform(post("/api/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content("""
                            {"name": "survive-test", "priority": "LOW", "timeoutMs": 10000}
                            """))
                .andExpect(status().isOk());

        // Query it back via the API — this is what Bobby Tables couldn't do before
        mockMvc.perform(get("/api/jobs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.name == 'survive-test')]").exists());
    }

    private String login(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format(
                                """
                                {"username": "%s", "password": "%s"}
                                """, username, password)))
                .andExpect(status().isOk())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        return body.split("\"token\":\"")[1].split("\"")[0];
    }
}
```

### Test: Startup Recovery

```java
// src/test/java/com/jobengine/service/StartupRecoveryTest.java
package com.jobengine.service;

import com.jobengine.IntegrationTestBase;
import com.jobengine.model.JobPriority;
import com.jobengine.model.JobStatus;
import com.jobengine.persistence.entity.JobRecord;
import com.jobengine.persistence.repository.JobRecordRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

class StartupRecoveryTest extends IntegrationTestBase {

    @Autowired private JobRecordRepository jobRecordRepository;
    @Autowired private StartupRecoveryService recoveryService;

    @Test
    void shouldMarkOrphanedRunningJobsAsFailed() {
        // Simulate a job that was RUNNING when the pod died
        JobRecord orphan = new JobRecord("orphan-1", "stuck-job",
                JobPriority.HIGH, 1L, 30000L);
        orphan.setStatus(JobStatus.RUNNING);
        orphan.setStartedAt(java.time.Instant.now().minusSeconds(300));
        jobRecordRepository.save(orphan);

        // Run recovery
        recoveryService.recoverOrphanedJobs();

        // Verify it's now FAILED with a clear reason
        JobRecord recovered = jobRecordRepository.findById("orphan-1").orElseThrow();
        assertThat(recovered.getStatus()).isEqualTo(JobStatus.FAILED);
        assertThat(recovered.getFailureReason()).contains("pod restarted");
        assertThat(recovered.getCompletedAt()).isNotNull();
    }

    @Test
    void shouldMarkOrphanedPendingJobsAsFailed() {
        JobRecord orphan = new JobRecord("orphan-2", "never-started",
                JobPriority.NORMAL, 1L, 5000L);
        // Status is PENDING by default
        jobRecordRepository.save(orphan);

        recoveryService.recoverOrphanedJobs();

        JobRecord recovered = jobRecordRepository.findById("orphan-2").orElseThrow();
        assertThat(recovered.getStatus()).isEqualTo(JobStatus.FAILED);
        assertThat(recovered.getFailureReason()).contains("pod restarted");
    }

    @Test
    void shouldNotTouchCompletedJobs() {
        JobRecord completed = new JobRecord("completed-1", "done-job",
                JobPriority.LOW, 1L, 5000L);
        completed.setStatus(JobStatus.COMPLETED);
        completed.setCompletedAt(java.time.Instant.now());
        jobRecordRepository.save(completed);

        recoveryService.recoverOrphanedJobs();

        JobRecord unchanged = jobRecordRepository.findById("completed-1").orElseThrow();
        assertThat(unchanged.getStatus()).isEqualTo(JobStatus.COMPLETED);
    }
}
```

### Run All Tests

```bash
./gradlew test
```

Green. All of them. The auth tests prove ZeroTrust's rules are enforced. The persistence tests prove Bobby Tables can query anything. The recovery tests prove a pod restart doesn't leave orphans.

![All chapter 12 tests passing](images/ch12-tests-green.svg)

> **@Linus:** 13 new integration tests. Real PostgreSQL. Real JWT. Real audit trail. This is how you prove a fix works.

You close your laptop. It's 6:02 PM on Monday. You made the deadline.

But Tuesday morning, TicketMaster pings you again.

> **@TicketMaster:** The `deploy-bot` service account submitted 47 jobs in 3 seconds before we disabled it. We need rate limiting. And the JWT token doesn't expire for an hour — what if someone's token gets stolen?

You look at Linus. He's already typing.

> **@Linus:** Refresh tokens. Rate limiting. Token revocation. PR by Friday.

Some things never change.

---

[← Chapter 11: Ship It to the Cloud](part-11-deployment.md) | [Chapter 13: 47 Jobs in 3 Seconds →](part-13-rate-limiting.md)