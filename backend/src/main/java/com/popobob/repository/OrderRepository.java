package com.popobob.repository;

import com.popobob.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByStatusInOrderByCreatedAtDesc(List<String> statuses);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByPaymentReference(String paymentReference);
}
