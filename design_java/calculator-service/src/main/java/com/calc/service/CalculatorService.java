package com.calc.service;

import com.calc.model.CalcRequest;
import com.calc.model.CalcResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.stereotype.Service;

@Service
@EnableCaching
public class CalculatorService {

    @Cacheable(value = "calculations", key = "#request.operation() + ':' + #request.a() + ':' + #request.b()")
    public CalcResponse calculate(CalcRequest request) {
        double result = compute(request.a(), request.b(), request.operation());
        String expression = formatExpression(request);
        // cached=false here; when served from cache Spring returns the cached object as-is
        return new CalcResponse(result, false, expression);
    }

    public double compute(double a, double b, CalcRequest.Operation op) {
        return switch (op) {
            case ADD -> a + b;
            case SUBTRACT -> a - b;
            case MULTIPLY -> a * b;
            case DIVIDE -> {
                if (b == 0) throw new ArithmeticException("Division by zero");
                yield a / b;
            }
            case POWER -> Math.pow(a, b);
            case MODULO -> {
                if (b == 0) throw new ArithmeticException("Modulo by zero");
                yield a % b;
            }
        };
    }

    private String formatExpression(CalcRequest req) {
        String symbol = switch (req.operation()) {
            case ADD -> "+";
            case SUBTRACT -> "-";
            case MULTIPLY -> "*";
            case DIVIDE -> "/";
            case POWER -> "^";
            case MODULO -> "%";
        };
        return req.a() + " " + symbol + " " + req.b();
    }
}
