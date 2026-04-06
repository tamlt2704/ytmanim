package com.notify.repository;

import com.notify.model.DeliveryStatus;
import com.notify.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findByIdempotencyKey(String idempotencyKey);
    List<Notification> findByUserIdAndStatus(String userId, DeliveryStatus status);
    long countByUserIdAndStatus(String userId, DeliveryStatus status);
}
