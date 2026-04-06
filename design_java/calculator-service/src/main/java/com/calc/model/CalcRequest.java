package com.calc.model;

import jakarta.validation.constraints.NotNull;

public record CalcRequest(
        @NotNull Double a,
        @NotNull Double b,
        @NotNull Operation operation
) {
    public enum Operation {
        ADD, SUBTRACT, MULTIPLY, DIVIDE, POWER, MODULO
    }
}
