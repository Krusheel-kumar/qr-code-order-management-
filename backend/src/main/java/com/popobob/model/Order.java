package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true)
    private String orderNumber;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Optional, for logged-in users
    
    private String customerName;
    private String customerPhone;
    private String tableNumber;
    
    private String storeId;
    private String orderType; // "DINE_IN" or "PICKUP"
    
    @Column(name = "payment_reference", unique = true)
    private String paymentReference;
    private String paymentStatus;
    
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
