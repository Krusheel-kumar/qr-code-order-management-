package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Order order;
    
    private String productId;
    private String productName;
    
    private Integer quantity;
    private BigDecimal subtotal;
    private String specialInstructions;
    @Column(columnDefinition = "TEXT")
    private String customizations;

    @ElementCollection
    @CollectionTable(
        name = "order_item_customizations",
        joinColumns = @JoinColumn(name = "order_item_id")
    )
    private List<OrderItemCustomization> customizationsList;
}
