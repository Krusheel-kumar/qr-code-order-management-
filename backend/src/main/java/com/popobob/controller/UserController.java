package com.popobob.controller;

import com.popobob.model.Order;
import com.popobob.model.User;
import com.popobob.repository.OrderRepository;
import com.popobob.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getUserOrders(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            // Need a custom query in OrderRepository, but since we don't have it yet, 
            // we can filter all orders. Wait, let's update OrderRepository.
            // For now, we will add the method to OrderRepository or just use findAll.
            List<Order> userOrders = orderRepository.findAll()
                .stream()
                .filter(order -> order.getUser() != null && order.getUser().getId().equals(id))
                .toList();
            return ResponseEntity.ok(userOrders);
        }
        return ResponseEntity.notFound().build();
    }
}
