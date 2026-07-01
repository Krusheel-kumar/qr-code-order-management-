package com.POP O'BOB®.service;

import com.POP O'BOB®.dto.OrderItemDto;
import com.POP O'BOB®.dto.OrderRequestDto;
import com.POP O'BOB®.model.Order;
import com.POP O'BOB®.model.OrderItem;
import com.POP O'BOB®.model.Product;
import com.POP O'BOB®.model.OrderSequence;
import com.POP O'BOB®.repository.OrderSequenceRepository;
import com.POP O'BOB®.repository.OrderRepository;
import com.POP O'BOB®.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.POP O'BOB®.model.User;
import com.POP O'BOB®.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderSequenceRepository sequenceRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Order createOrder(OrderRequestDto request) {
        Order order = new Order();
        
        // Generate Order Number
        OrderSequence seq = sequenceRepository.findAndLockById().orElseGet(() -> {
            OrderSequence newSeq = new OrderSequence();
            return sequenceRepository.save(newSeq);
        });
        order.setOrderNumber("POB-" + seq.getNextVal());
        seq.setNextVal(seq.getNextVal() + 1);
        sequenceRepository.save(seq);

        order.setStatus("PLACED");
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setTableNumber(request.getTableNumber());
        order.setOrderType(request.getOrderType());
        order.setStoreId(request.getStoreId());
        order.setPaymentReference(request.getPaymentReference());
        order.setPaymentStatus(request.getPaymentReference() != null ? "PAID" : "PENDING");
        
        if (request.getUserId() != null) {
            userRepository.findById(request.getUserId()).ifPresent(order::setUser);
        }
        
        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemDto itemDto : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(itemDto.getProductId());
            item.setProductName(itemDto.getProductName());
            item.setQuantity(itemDto.getQuantity());
            item.setSpecialInstructions(itemDto.getSpecialInstructions());
            item.setCustomizations(itemDto.getCustomizations());
            
            BigDecimal subtotal = itemDto.getSubtotal() != null ? itemDto.getSubtotal() : itemDto.getPrice().multiply(new BigDecimal(itemDto.getQuantity()));
            item.setSubtotal(subtotal);
            totalAmount = totalAmount.add(subtotal);
            items.add(item);
        }

        order.setItems(items);
        // Apply Wallet Discount if points used
        if (request.getPointsUsed() != null && request.getPointsUsed() > 0 && order.getUser() != null) {
            User user = order.getUser();
            int currentPoints = user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints();
            if (currentPoints >= request.getPointsUsed()) {
                user.setLoyaltyPoints(currentPoints - request.getPointsUsed());
                // 10 points = 1 currency unit
                BigDecimal discount = new BigDecimal(request.getPointsUsed()).divide(new BigDecimal("10"));
                totalAmount = totalAmount.subtract(discount);
                if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
                    totalAmount = BigDecimal.ZERO;
                }
            }
        }
        
        order.setTotalAmount(totalAmount);
        
        // Calculate and add loyalty points based on Tier Multiplier
        if (order.getUser() != null) {
            User user = order.getUser();
            int currentPoints = user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints();
            
            // Determine multiplier based on current points (Tiers)
            double multiplier = 1.0; // Bronze
            if (currentPoints >= 2000) multiplier = 1.5; // Gold
            else if (currentPoints >= 500) multiplier = 1.2; // Silver
            
            int basePoints = totalAmount.divideToIntegralValue(new BigDecimal("10")).intValue();
            int earnedPoints = (int) (basePoints * multiplier);
            
            user.setLoyaltyPoints(currentPoints + earnedPoints);
            userRepository.save(user);
        }
        
        Order savedOrder = orderRepository.save(order);
        
        // Notify Staff KDS via WebSocket
        messagingTemplate.convertAndSend("/topic/orders", savedOrder);
        
        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(UUID orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        
        // Notify Staff and Customer
        messagingTemplate.convertAndSend("/topic/orders", savedOrder);
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, savedOrder);
        
        return savedOrder;
    }

    public List<Order> getActiveOrders() {
        return orderRepository.findByStatusInOrderByCreatedAtDesc(List.of("PLACED", "PREPARING", "READY"));
    }

    public Order getOrderById(UUID id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrdersHistory() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
