package com.bank.model;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record TransferRequest(
        @NotBlank String idempotencyKey,
        @NotBlank String fromAccountId,
        @NotBlank String toAccountId,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount
) {}
