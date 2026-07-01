package com.POP O'BOB®.controller;

import com.POP O'BOB®.dto.OrderRequestDto;
import com.POP O'BOB®.model.Order;
import com.POP O'BOB®.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor

public class OrderController {
    
    private final OrderService orderService;

    @PostMapping
    public Order placeOrder(@RequestBody OrderRequestDto request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/active")
    public List<Order> getActiveOrders() {
        return orderService.getActiveOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable UUID id) {
        return orderService.getOrderById(id);
    }

    @PatchMapping("/{id}/status")
    public Order updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }

    @GetMapping("/history")
    public List<Order> getOrderHistory() {
        return orderService.getAllOrdersHistory();
    }
}
