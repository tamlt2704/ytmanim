package com.calc.controller;

import com.calc.model.CalcRequest;
import com.calc.model.CalcResponse;
import com.calc.service.CalculatorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calc")
public class CalculatorController {

    private final CalculatorService calculatorService;

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping
    public ResponseEntity<CalcResponse> calculate(@Valid @RequestBody CalcRequest request) {
        return ResponseEntity.ok(calculatorService.calculate(request));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
