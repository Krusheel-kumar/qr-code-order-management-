package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "stores")
public class Store {
    @Id
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Version
    @Column(nullable = false)
    private Integer version = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ElementCollection
    @CollectionTable(
        name = "store_product_blacklists",
        joinColumns = @JoinColumn(name = "store_id")
    )
    @Column(name = "product_id")
    private List<String> blacklistedProductIds = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(
        name = "store_option_blacklists",
        joinColumns = @JoinColumn(name = "store_id")
    )
    @Column(name = "option_id")
    private List<String> blacklistedOptionIds = new ArrayList<>();
}
