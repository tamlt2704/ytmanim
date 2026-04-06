package com.bank.controller;

import com.bank.model.Account;
import com.bank.model.TransferRequest;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransferEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TransferControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransferEventRepository transferEventRepository;

    @BeforeEach
    void setUp() {
        transferEventRepository.deleteAll();
        accountRepository.deleteAll();
        accountRepository.save(new Account("ACC1", new BigDecimal("5000.00")));
        accountRepository.save(new Account("ACC2", new BigDecimal("3000.00")));
    }

    @Test
    void shouldProcessSyncTransfer() throws Exception {
        TransferRequest request = new TransferRequest("sync-1", "ACC1", "ACC2", new BigDecimal("500.00"));

        mockMvc.perform(post("/api/transfers/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.idempotencyKey").value("sync-1"));
    }

    @Test
    void shouldAcceptAsyncTransfer() throws Exception {
        TransferRequest request = new TransferRequest("async-1", "ACC1", "ACC2", new BigDecimal("100.00"));

        mockMvc.perform(post("/api/transfers/async")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("ACCEPTED"))
                .andExpect(jsonPath("$.idempotencyKey").value("async-1"));
    }

    @Test
    void shouldGetTransferStatus() throws Exception {
        TransferRequest request = new TransferRequest("status-1", "ACC1", "ACC2", new BigDecimal("100.00"));
        mockMvc.perform(post("/api/transfers/sync")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        mockMvc.perform(get("/api/transfers/status-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void shouldReturn404ForUnknownTransfer() throws Exception {
        mockMvc.perform(get("/api/transfers/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn400ForInvalidRequest() throws Exception {
        mockMvc.perform(post("/api/transfers/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400ForNegativeAmount() throws Exception {
        TransferRequest request = new TransferRequest("neg-1", "ACC1", "ACC2", new BigDecimal("-50.00"));

        mockMvc.perform(post("/api/transfers/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400ForZeroAmount() throws Exception {
        TransferRequest request = new TransferRequest("zero-1", "ACC1", "ACC2", new BigDecimal("0.00"));

        mockMvc.perform(post("/api/transfers/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldHandleSyncInsufficientFunds() throws Exception {
        TransferRequest request = new TransferRequest("insuf-1", "ACC1", "ACC2", new BigDecimal("99999.00"));

        mockMvc.perform(post("/api/transfers/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FAILED_INSUFFICIENT_FUNDS"));
    }

    @Test
    void shouldHandleSameAccountTransfer() throws Exception {
        TransferRequest request = new TransferRequest("same-1", "ACC1", "ACC1", new BigDecimal("100.00"));

        mockMvc.perform(post("/api/transfers/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FAILED_SAME_ACCOUNT"));
    }
}
