package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "store_locations")
public class StoreLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String address;
    private String phone;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}
