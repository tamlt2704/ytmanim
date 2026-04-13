# Chapter 11: Ship It to the Cloud

[← Chapter 10: You Ship It](part-10-full-engine.md) | [Chapter 12: Who Did What, and Where's the Proof? →](part-12-database-auth-audit.md)

---

## The Incident

The engine works. 26 tests green. Linus approved the PR. You're running it on your laptop and feeling invincible.

Then TicketMaster walks over. "Demo's Thursday. The VP wants to see it live. Not localhost. Not 'it works on my machine.' A real URL."

You look at FiveNines. He's already shaking his head. "If you deploy this without health checks, I will find you."

> **@ZeroTrust:** And if I see a single credential in that repo, I'm revoking your badge.

So now you need to deploy the job engine backend AND the dashboard frontend to the cloud. Two apps. One URL for the API, one for the UI. By Thursday.

![The intern deploys to the cloud](images/ch11-deploy-to-cloud.svg)

You grab a coffee. A big one.

## What You're Deploying

Two things:

1. The job engine — a Spring Boot 3.3 app, Java 21, virtual threads. It exposes a REST API and a WebSocket endpoint.
2. The dashboard — a React 19 + Vite app. Static files that talk to the API.

```
┌──────────────────────────────────────────────────────────┐
│  Internet                                                │
│                                                          │
│  dashboard.yourapp.com ──→ Static files (React/Vite)     │
│  api.yourapp.com       ──→ Spring Boot (Job Engine)      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The frontend is easy — it's just HTML, CSS, and JS. Any CDN or static host works. The backend is the tricky part: it's a JVM process that needs memory, CPU, and a port.

## Step 1: Make the Backend Deployable

Right now the engine runs embedded in Spring Boot. That's already a fat JAR — one file, everything included. But you need a few things before it's cloud-ready.

### Health Check Endpoint

FiveNines wasn't kidding. Every cloud platform needs a way to know your app is alive.

Add Spring Boot Actuator:

```groovy
// build.gradle — add to dependencies
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'  // ← new

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```

Configure it to expose only what you need:

```yaml
# src/main/resources/application.yml
spring:
  application:
    name: job-engine
  threads:
    virtual:
      enabled: true
  main:
    allow-bean-definition-overriding: false

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
```

That last line is important. Cloud platforms set the `PORT` environment variable. Your app needs to listen on it. If `PORT` isn't set, it falls back to 8080 for local dev.

Now `GET /actuator/health` returns `{"status":"UP"}`. FiveNines can sleep.

### CORS — Let the Frontend Talk to the Backend

The dashboard runs on a different domain than the API. Browsers block cross-origin requests by default. You need to allow it.

```java
// src/main/java/com/jobengine/config/WebConfig.java
package com.jobengine.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

In production, you set `APP_CORS_ALLOWED_ORIGINS=https://dashboard.yourapp.com`. In dev, it defaults to Vite's dev server.

> **@ZeroTrust:** "allowedOrigins('*')". Don't even think about it.

### Build the Fat JAR

```bash
./gradlew bootJar
```

This produces `build/libs/job-engine-1.0.0.jar`. One file. Run it anywhere Java 21 exists:

```bash
java -jar build/libs/job-engine-1.0.0.jar
```

## Step 2: Containerize the Backend

Cloud platforms love containers. You write a Dockerfile.

```dockerfile
# Dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

COPY build/libs/job-engine-1.0.0.jar app.jar

# Non-root user — ZeroTrust approved
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
  "-XX:+UseZGC", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
```

A few decisions here:

- `eclipse-temurin:21-jre-alpine` — smallest JRE image. ~80MB instead of ~400MB.
- `UseZGC` — low-latency garbage collector. Good for virtual threads.
- `MaxRAMPercentage=75.0` — the JVM uses 75% of the container's memory limit. Leaves room for the OS and off-heap buffers.
- Non-root user — because ZeroTrust is watching.

Build and test locally:

```bash
./gradlew bootJar
docker build -t job-engine:1.0.0 .
docker run -p 8080:8080 job-engine:1.0.0
```

Hit `http://localhost:8080/actuator/health`. You should see `{"status":"UP"}`.

## Step 3: Build the Frontend for Production

The dashboard is a Vite app. Production build is one command:

```bash
npm run build
```

This outputs static files to `dist/`:

```
dist/
├── index.html
├── assets/
│   ├── index-a1b2c3d4.js    (your app, minified)
│   ├── index-e5f6g7h8.css   (your styles, minified)
│   └── vendor-i9j0k1l2.js   (React, TanStack Query, etc.)
└── favicon.ico
```

That's it. No server needed. These files go on a CDN.

### Environment Variables at Build Time

The frontend needs to know where the API lives. Vite handles this with `.env` files:

```bash
# .env.production
VITE_API_URL=https://api.yourapp.com
VITE_WS_URL=wss://api.yourapp.com/ws/jobs
```

In your code, you reference them as `import.meta.env.VITE_API_URL`. Vite bakes them into the bundle at build time.

```bash
# Build with production API URL
VITE_API_URL=https://api.yourapp.com npm run build
```

## Step 4: Deploy the Backend

You have options. Here are three, from simplest to most control.

### Option A: Railway / Render / Fly.io (Easiest)

These platforms deploy Docker containers with zero config. Pick one.

For Railway:

```bash
# Install the CLI
npm install -g @railway/cli

# Login and init
railway login
railway init

# Deploy — it detects the Dockerfile
railway up
```

Railway gives you a URL like `job-engine-production.up.railway.app`. Set your environment variables in the dashboard:

```
PORT=8080
APP_CORS_ALLOWED_ORIGINS=https://dashboard.yourapp.com
```

For Fly.io:

```bash
# Install and login
curl -L https://fly.io/install.sh | sh
fly auth login

# Launch — it detects the Dockerfile
fly launch --name job-engine --region iad

# Deploy
fly deploy
```

Fly gives you `job-engine.fly.dev`.

### Option B: Cloud Run (Google Cloud)

Serverless containers. You pay only when requests come in. Good for a demo.

```bash
# Build and push the image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/job-engine:1.0.0

# Deploy
gcloud run deploy job-engine \
  --image gcr.io/YOUR_PROJECT/job-engine:1.0.0 \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 5 \
  --set-env-vars "APP_CORS_ALLOWED_ORIGINS=https://dashboard.yourapp.com" \
  --allow-unauthenticated \
  --region us-east1
```

`min-instances=1` keeps one instance warm so the VP doesn't see a cold start during the demo. In production, you'd set it to 0 and accept the occasional 2-second startup.

### Option C: ECS / Kubernetes (Full Control)

For when you outgrow the simple platforms. You write a deployment manifest:

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-engine
spec:
  replicas: 2
  selector:
    matchLabels:
      app: job-engine
  template:
    metadata:
      labels:
        app: job-engine
    spec:
      containers:
        - name: job-engine
          image: your-registry/job-engine:1.0.0
          ports:
            - containerPort: 8080
          env:
            - name: APP_CORS_ALLOWED_ORIGINS
              value: "https://dashboard.yourapp.com"
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: job-engine
spec:
  selector:
    app: job-engine
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

```bash
kubectl apply -f k8s/deployment.yaml
```

This gives you 2 replicas, health checks, auto-restart on failure, and a load balancer. FiveNines approves.

## Step 5: Deploy the Frontend

Static files. Many options, all simple.

### Option A: Vercel (Easiest for Vite/React)

```bash
npm install -g vercel
vercel --prod
```

Done. Vercel detects Vite, runs `npm run build`, serves `dist/`. You get a URL like `dashboard-yourapp.vercel.app`.

Set the environment variable in Vercel's dashboard:

```
VITE_API_URL=https://api.yourapp.com
```

### Option B: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Same idea. Static hosting with a CDN.

### Option C: Cloud Storage + CDN

For Google Cloud:

```bash
# Create a bucket
gsutil mb gs://dashboard-yourapp

# Upload the build
gsutil -m cp -r dist/* gs://dashboard-yourapp

# Make it public
gsutil iam ch allUsers:objectViewer gs://dashboard-yourapp

# Set the main page
gsutil web set -m index.html -e index.html gs://dashboard-yourapp
```

Put a CDN (Cloud CDN, CloudFront) in front of it for caching and HTTPS.

## Step 6: Wire Them Together

The frontend calls the backend. You need:

1. The backend URL set in the frontend's environment
2. CORS configured on the backend to allow the frontend's domain
3. HTTPS on both (every platform above gives you this for free)

```
┌─────────────────┐         ┌──────────────────┐
│  Vercel CDN     │  HTTPS  │  Railway / Cloud  │
│  dashboard.     │────────→│  api.yourapp.com  │
│  yourapp.com    │         │  :8080            │
│                 │         │                   │
│  React app      │         │  Spring Boot      │
│  (static files) │         │  (job engine)     │
└─────────────────┘         └──────────────────┘
```

Test the connection:

```bash
# Health check
curl https://api.yourapp.com/actuator/health

# Submit a job
curl -X POST https://api.yourapp.com/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"name": "demo-job", "priority": "HIGH"}'

# Check metrics
curl https://api.yourapp.com/api/metrics
```

Open the dashboard in a browser. You should see the metrics cards, the job list, and the submit form — all talking to the live API.

## Step 7: CI/CD — Don't Deploy by Hand

You deployed manually for the demo. That's fine once. But TicketMaster is already filing tickets for new features, and you're not going to SSH into a server every time.

GitHub Actions. One workflow for each app.

### Backend CI/CD

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ['job-engine/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
      - name: Run tests
        run: ./gradlew test
        working-directory: job-engine

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
      - name: Build JAR
        run: ./gradlew bootJar
        working-directory: job-engine
      - name: Build and push Docker image
        run: |
          docker build -t your-registry/job-engine:${{ github.sha }} .
          docker push your-registry/job-engine:${{ github.sha }}
        working-directory: job-engine
      # Add your platform-specific deploy step here
      # Railway: railway up
      # Cloud Run: gcloud run deploy ...
      # K8s: kubectl set image ...
```

### Frontend CI/CD

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ['dashboard/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: dashboard
      - run: npm run lint
        working-directory: dashboard
      - run: npm run test -- --run
        working-directory: dashboard

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: dashboard
      - run: npm run build
        working-directory: dashboard
        env:
          VITE_API_URL: ${{ vars.API_URL }}
      # Add your platform-specific deploy step here
      # Vercel: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      # Netlify: netlify deploy --prod --dir=dist
```

Push to `main`. Tests run. If green, it deploys. No manual steps.

## The Checklist

Before the demo, you run through FiveNines' deployment checklist:

| Check | Status |
|-------|--------|
| Health endpoint responds | ✅ `GET /actuator/health` → `{"status":"UP"}` |
| CORS allows dashboard origin | ✅ No browser console errors |
| HTTPS on both domains | ✅ Platforms handle TLS |
| Non-root container user | ✅ ZeroTrust verified |
| No credentials in repo | ✅ All in environment variables |
| CI/CD pipeline green | ✅ Tests pass, auto-deploy works |
| Frontend talks to backend | ✅ Jobs list loads, metrics update |
| WebSocket connects | ✅ Real-time status updates work |

## The Demo

Thursday. The VP opens the dashboard URL on her laptop. The metrics cards show live numbers. She submits a job from the form. It appears in the list as PENDING, flips to RUNNING, then COMPLETED. The metrics update in real-time.

"How many concurrent jobs can it handle?" she asks.

"We tested 1,000 concurrent submissions. All processed. Backpressure kicks in if the queue fills up — returns 429, no crashes," you say.

She nods. "Ship it to production."

You look at Linus. He's already reviewing the production config PR.

FiveNines whispers from across the room: "99.999%."

---

[← Chapter 10: You Ship It](part-10-full-engine.md) | [Chapter 12: Who Did What, and Where's the Proof? →](part-12-database-auth-audit.md)
