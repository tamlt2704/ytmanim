package com.bank.service;

import com.bank.model.*;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransferEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TransferServiceTest {

    @Autowired
    private TransferService transferService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransferEventRepository transferEventRepository;

    @BeforeEach
    void setUp() {
        transferEventRepository.deleteAll();
        accountRepository.deleteAll();
    }

    private void createAccount(String id, String balance) {
        accountRepository.save(new Account(id, new BigDecimal(balance)));
    }

    private TransferRequest request(String from, String to, String amount) {
        return new TransferRequest(UUID.randomUUID().toString(), from, to, new BigDecimal(amount));
    }

    private TransferRequest requestWithKey(String key, String from, String to, String amount) {
        return new TransferRequest(key, from, to, new BigDecimal(amount));
    }

    @Nested
    class HappyPath {

        @Test
        void shouldTransferSuccessfully() {
            createAccount("A", "1000.00");
            createAccount("B", "500.00");

            TransferRequest req = request("A", "B", "200.00");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getStatus()).isEqualTo(TransferStatus.COMPLETED);
            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("800.00");
            assertThat(accountRepository.findById("B").get().getBalance())
                    .isEqualByComparingTo("700.00");
        }

        @Test
        void shouldTransferEntireBalance() {
            createAccount("A", "500.00");
            createAccount("B", "0.00");

            TransferRequest req = request("A", "B", "500.00");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getStatus()).isEqualTo(TransferStatus.COMPLETED);
            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("0.00");
            assertThat(accountRepository.findById("B").get().getBalance())
                    .isEqualByComparingTo("500.00");
        }

        @Test
        void shouldHandleSmallAmounts() {
            createAccount("A", "100.00");
            createAccount("B", "100.00");

            TransferRequest req = request("A", "B", "0.01");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getStatus()).isEqualTo(TransferStatus.COMPLETED);
            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("99.99");
        }
    }

    @Nested
    class ValidationFailures {

        @Test
        void shouldRejectSameAccountTransfer() {
            createAccount("A", "1000.00");

            TransferRequest req = request("A", "A", "100.00");
            TransferEvent result = transferService.submitTransfer(req);

            assertThat(result.getStatus()).isEqualTo(TransferStatus.FAILED_SAME_ACCOUNT);
            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("1000.00");
        }

        @Test
        void shouldRejectInsufficientFunds() {
            createAccount("A", "50.00");
            createAccount("B", "100.00");

            TransferRequest req = request("A", "B", "100.00");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getStatus()).isEqualTo(TransferStatus.FAILED_INSUFFICIENT_FUNDS);
            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("50.00");
            assertThat(accountRepository.findById("B").get().getBalance())
                    .isEqualByComparingTo("100.00");
        }

        @Test
        void shouldRejectWhenSourceAccountNotFound() {
            createAccount("B", "100.00");

            TransferRequest req = request("NONEXISTENT", "B", "50.00");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getStatus()).isEqualTo(TransferStatus.FAILED_ACCOUNT_NOT_FOUND);
        }

        @Test
        void shouldRejectWhenDestinationAccountNotFound() {
            createAccount("A", "100.00");

            TransferRequest req = request("A", "NONEXISTENT", "50.00");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getStatus()).isEqualTo(TransferStatus.FAILED_ACCOUNT_NOT_FOUND);
        }
    }

    @Nested
    class Idempotency {

        @Test
        void shouldReturnExistingEventForDuplicateKey() {
            createAccount("A", "1000.00");
            createAccount("B", "500.00");

            String key = "dup-key-123";
            TransferRequest req1 = requestWithKey(key, "A", "B", "100.00");
            TransferRequest req2 = requestWithKey(key, "A", "B", "100.00");

            TransferEvent first = transferService.submitTransfer(req1);
            TransferEvent second = transferService.submitTransfer(req2);

            assertThat(first.getId()).isEqualTo(second.getId());
            assertThat(transferEventRepository.findAll()).hasSize(1);
        }

        @Test
        void shouldNotDoubleDebitOnDuplicateExecution() {
            createAccount("A", "1000.00");
            createAccount("B", "500.00");

            TransferRequest req = request("A", "B", "200.00");
            transferService.submitTransfer(req);
            transferService.executeTransfer(req.idempotencyKey());
            transferService.executeTransfer(req.idempotencyKey()); // duplicate

            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("800.00");
        }
    }

    @Nested
    class Concurrency {

        @Test
        void shouldHandleConcurrentTransfersFromSameAccount() throws Exception {
            createAccount("A", "1000.00");
            createAccount("B", "0.00");
            createAccount("C", "0.00");

            int threads = 10;
            BigDecimal amountEach = new BigDecimal("50.00");
            CountDownLatch latch = new CountDownLatch(threads);
            AtomicInteger successCount = new AtomicInteger(0);

            try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                for (int i = 0; i < threads; i++) {
                    String toAccount = (i % 2 == 0) ? "B" : "C";
                    TransferRequest req = request("A", toAccount, amountEach.toPlainString());
                    executor.submit(() -> {
                        try {
                            transferService.submitTransfer(req);
                            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());
                            if (result.getStatus() == TransferStatus.COMPLETED) {
                                successCount.incrementAndGet();
                            }
                        } catch (Exception e) {
                            // optimistic lock exception expected under contention
                        } finally {
                            latch.countDown();
                        }
                    });
                }
                latch.await(30, TimeUnit.SECONDS);
            }

            // Total balance must be conserved
            BigDecimal totalBalance = accountRepository.findAll().stream()
                    .map(Account::getBalance)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            assertThat(totalBalance).isEqualByComparingTo("1000.00");
        }

        @Test
        void shouldPreventOverdraftUnderConcurrency() throws Exception {
            createAccount("A", "100.00");
            createAccount("B", "0.00");

            int threads = 20;
            CountDownLatch latch = new CountDownLatch(threads);
            AtomicInteger successCount = new AtomicInteger(0);

            try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                for (int i = 0; i < threads; i++) {
                    TransferRequest req = request("A", "B", "100.00");
                    executor.submit(() -> {
                        try {
                            transferService.submitTransfer(req);
                            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());
                            if (result.getStatus() == TransferStatus.COMPLETED) {
                                successCount.incrementAndGet();
                            }
                        } catch (Exception e) {
                            // expected
                        } finally {
                            latch.countDown();
                        }
                    });
                }
                latch.await(30, TimeUnit.SECONDS);
            }

            assertThat(successCount.get()).isLessThanOrEqualTo(1);
            assertThat(accountRepository.findById("A").get().getBalance())
                    .isGreaterThanOrEqualTo(BigDecimal.ZERO);
        }
    }

    @Nested
    class EdgeCases {

        @Test
        void shouldHandleMultipleSequentialTransfers() {
            createAccount("A", "1000.00");
            createAccount("B", "1000.00");

            for (int i = 0; i < 10; i++) {
                TransferRequest req = request("A", "B", "10.00");
                transferService.submitTransfer(req);
                transferService.executeTransfer(req.idempotencyKey());
            }

            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("900.00");
            assertThat(accountRepository.findById("B").get().getBalance())
                    .isEqualByComparingTo("1100.00");
        }

        @Test
        void shouldHandleBidirectionalTransfers() {
            createAccount("A", "500.00");
            createAccount("B", "500.00");

            TransferRequest aToB = request("A", "B", "200.00");
            transferService.submitTransfer(aToB);
            transferService.executeTransfer(aToB.idempotencyKey());

            TransferRequest bToA = request("B", "A", "100.00");
            transferService.submitTransfer(bToA);
            transferService.executeTransfer(bToA.idempotencyKey());

            assertThat(accountRepository.findById("A").get().getBalance())
                    .isEqualByComparingTo("400.00");
            assertThat(accountRepository.findById("B").get().getBalance())
                    .isEqualByComparingTo("600.00");
        }

        @Test
        void shouldRecordProcessedTimestamp() {
            createAccount("A", "1000.00");
            createAccount("B", "500.00");

            TransferRequest req = request("A", "B", "100.00");
            transferService.submitTransfer(req);
            TransferEvent result = transferService.executeTransfer(req.idempotencyKey());

            assertThat(result.getProcessedAt()).isNotNull();
            assertThat(result.getCreatedAt()).isNotNull();
            assertThat(result.getProcessedAt()).isAfterOrEqualTo(result.getCreatedAt());
        }
    }
}
