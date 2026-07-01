package com.POP O'BOB®.repository;

import com.POP O'BOB®.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByStatusInOrderByCreatedAtDesc(List<String> statuses);
    List<Order> findAllByOrderByCreatedAtDesc();
}
