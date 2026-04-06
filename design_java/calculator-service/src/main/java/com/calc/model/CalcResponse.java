package com.calc.model;

public record CalcResponse(
        double result,
        boolean cached,
        String expression
) {}
