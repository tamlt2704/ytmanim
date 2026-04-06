package com.bank.model;

public enum TransferStatus {
    PENDING,
    COMPLETED,
    FAILED_INSUFFICIENT_FUNDS,
    FAILED_ACCOUNT_NOT_FOUND,
    FAILED_SAME_ACCOUNT,
    FAILED_INVALID_AMOUNT,
    DUPLICATE
}
