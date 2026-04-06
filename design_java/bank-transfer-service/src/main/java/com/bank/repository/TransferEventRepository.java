package com.bank.repository;

import com.bank.model.TransferEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransferEventRepository extends JpaRepository<TransferEvent, Long> {
    Optional<TransferEvent> findByIdempotencyKey(String idempotencyKey);
    boolean existsByIdempotencyKey(String idempotencyKey);
}
