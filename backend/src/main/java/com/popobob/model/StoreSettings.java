package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "store_settings")
public class StoreSettings {
    @Id
    private Long id = 1L; // Single row table
    
    private Double taxRate;
    private Double deliveryFee;
    private Double packingCharge;
    private Integer prepTime;
    private Boolean isStoreActive = true;
}
