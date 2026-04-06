package com.notify.controller;

import com.notify.model.Channel;
import com.notify.model.NotificationRequest;
import com.notify.model.Priority;
import com.notify.repository.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NotificationRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldSendSyncNotification() throws Exception {
        var req = new NotificationRequest("ctrl-1", "user1", Channel.EMAIL,
                Priority.NORMAL, "welcome", Map.of("name", "Alice"), null);

        mockMvc.perform(post("/api/notifications/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SENT"))
                .andExpect(jsonPath("$.renderedContent").value("Welcome Alice! Your account is ready."));
    }

    @Test
    void shouldAcceptAsyncNotification() throws Exception {
        var req = new NotificationRequest("ctrl-2", "user1", Channel.SMS,
                Priority.NORMAL, "otp", Map.of("code", "123", "expiry", "5"), null);

        mockMvc.perform(post("/api/notifications/async")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.idempotencyKey").value("ctrl-2"))
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
    }

    @Test
    void shouldGetNotificationStatus() throws Exception {
        var req = new NotificationRequest("ctrl-3", "user1", Channel.PUSH,
                Priority.NORMAL, "alert", Map.of("message", "test"), null);
        mockMvc.perform(post("/api/notifications/sync")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)));

        mockMvc.perform(get("/api/notifications/ctrl-3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SENT"));
    }

    @Test
    void shouldReturn404ForUnknownNotification() throws Exception {
        mockMvc.perform(get("/api/notifications/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn400ForInvalidRequest() throws Exception {
        mockMvc.perform(post("/api/notifications/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400ForUnknownTemplate() throws Exception {
        var req = new NotificationRequest("ctrl-bad", "user1", Channel.EMAIL,
                Priority.NORMAL, "nonexistent", Map.of(), null);

        mockMvc.perform(post("/api/notifications/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Unknown template: nonexistent"));
    }
}
