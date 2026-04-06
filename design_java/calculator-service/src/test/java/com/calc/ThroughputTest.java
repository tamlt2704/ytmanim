package com.calc;

import com.calc.model.CalcRequest;
import com.calc.model.CalcRequest.Operation;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Throughput test — fires 10,000 requests using virtual threads.
 * Requires a real Redis instance running on localhost:6379.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ThroughputTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldHandle10kRequests() throws Exception {
        int totalRequests = 10_000;
        int concurrency = 200;
        Semaphore semaphore = new Semaphore(concurrency);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);
        AtomicReference<String> firstError = new AtomicReference<>();
        Operation[] ops = Operation.values();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            CountDownLatch latch = new CountDownLatch(totalRequests);

            long start = System.currentTimeMillis();

            for (int i = 0; i < totalRequests; i++) {
                final int idx = i;
                executor.submit(() -> {
                    try {
                        semaphore.acquire();
                        Operation op = ops[idx % ops.length];
                        double a = (idx % 100) + 1;
                        double b = (idx % 50) + 1;
                        CalcRequest request = new CalcRequest(a, b, op);

                        MvcResult result = mockMvc.perform(post("/api/calc")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(request)))
                                .andReturn();

                        if (result.getResponse().getStatus() == 200) {
                            successCount.incrementAndGet();
                        } else {
                            failCount.incrementAndGet();
                            firstError.compareAndSet(null,
                                    "HTTP " + result.getResponse().getStatus() + ": " +
                                    result.getResponse().getContentAsString());
                        }
                    } catch (Exception e) {
                        failCount.incrementAndGet();
                        firstError.compareAndSet(null, e.getClass().getSimpleName() + ": " + e.getMessage());
                    } finally {
                        semaphore.release();
                        latch.countDown();
                    }
                });
            }

            boolean completed = latch.await(120, TimeUnit.SECONDS);
            long elapsed = System.currentTimeMillis() - start;

            System.out.println("=== Throughput Test Results ===");
            System.out.println("Total requests: " + totalRequests);
            System.out.println("Successful:     " + successCount.get());
            System.out.println("Failed:         " + failCount.get());
            System.out.println("Time elapsed:   " + elapsed + " ms");
            System.out.println("Throughput:     " + (totalRequests * 1000L / Math.max(elapsed, 1)) + " req/s");
            if (firstError.get() != null) {
                System.out.println("First error:    " + firstError.get());
            }

            assertThat(completed).as("All requests should complete within timeout").isTrue();
            assertThat(successCount.get()).as("All requests should succeed. First error: " + firstError.get())
                    .isEqualTo(totalRequests);
        }
    }
}
