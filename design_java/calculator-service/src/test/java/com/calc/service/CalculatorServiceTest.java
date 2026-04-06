package com.calc.service;

import com.calc.model.CalcRequest;
import com.calc.model.CalcRequest.Operation;
import com.calc.model.CalcResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.*;

class CalculatorServiceTest {

    private final CalculatorService service = new CalculatorService();

    @ParameterizedTest
    @CsvSource({
            "10, 5, ADD, 15.0",
            "10, 5, SUBTRACT, 5.0",
            "10, 5, MULTIPLY, 50.0",
            "10, 5, DIVIDE, 2.0",
            "2, 10, POWER, 1024.0",
            "10, 3, MODULO, 1.0"
    })
    void shouldComputeCorrectly(double a, double b, Operation op, double expected) {
        double result = service.compute(a, b, op);
        assertThat(result).isEqualTo(expected);
    }

    @Test
    void shouldThrowOnDivisionByZero() {
        assertThatThrownBy(() -> service.compute(10, 0, Operation.DIVIDE))
                .isInstanceOf(ArithmeticException.class)
                .hasMessage("Division by zero");
    }

    @Test
    void shouldThrowOnModuloByZero() {
        assertThatThrownBy(() -> service.compute(10, 0, Operation.MODULO))
                .isInstanceOf(ArithmeticException.class)
                .hasMessage("Modulo by zero");
    }

    @Test
    void shouldReturnCalcResponse() {
        CalcRequest request = new CalcRequest(3.0, 4.0, Operation.ADD);
        CalcResponse response = service.calculate(request);

        assertThat(response.result()).isEqualTo(7.0);
        assertThat(response.expression()).isEqualTo("3.0 + 4.0");
        assertThat(response.cached()).isFalse();
    }

    @Test
    void shouldHandleNegativeNumbers() {
        assertThat(service.compute(-5, 3, Operation.ADD)).isEqualTo(-2.0);
        assertThat(service.compute(-5, -3, Operation.MULTIPLY)).isEqualTo(15.0);
    }

    @Test
    void shouldHandleDecimalNumbers() {
        assertThat(service.compute(1.5, 2.5, Operation.ADD)).isEqualTo(4.0);
        assertThat(service.compute(7.5, 2.5, Operation.DIVIDE)).isEqualTo(3.0);
    }
}
