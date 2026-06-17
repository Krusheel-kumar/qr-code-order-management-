package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    
    private String name;
    private String description;
    private BigDecimal price;
    private Boolean isAvailable = true;
    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
