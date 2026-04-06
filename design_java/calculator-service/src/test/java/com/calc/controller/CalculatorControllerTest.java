package com.calc.controller;

import com.calc.model.CalcRequest;
import com.calc.model.CalcRequest.Operation;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CalculatorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCalculateAddition() throws Exception {
        CalcRequest request = new CalcRequest(10.0, 5.0, Operation.ADD);

        mockMvc.perform(post("/api/calc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(15.0))
                .andExpect(jsonPath("$.expression").value("10.0 + 5.0"));
    }

    @Test
    void shouldCalculateDivision() throws Exception {
        CalcRequest request = new CalcRequest(20.0, 4.0, Operation.DIVIDE);

        mockMvc.perform(post("/api/calc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(5.0));
    }

    @Test
    void shouldReturn400ForMissingFields() throws Exception {
        mockMvc.perform(post("/api/calc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnHealthCheck() throws Exception {
        mockMvc.perform(get("/api/calc/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("OK"));
    }

    @Test
    void shouldHandlePowerOperation() throws Exception {
        CalcRequest request = new CalcRequest(2.0, 8.0, Operation.POWER);

        mockMvc.perform(post("/api/calc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(256.0));
    }
}
