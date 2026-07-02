package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "store_settings")
public class StoreSettings {
    @Id
    private Long id = 1L;
    
    private Double taxRate;
    private Double deliveryFee;
    private Double packingCharge;
    private Integer prepTime;
    
    @com.fasterxml.jackson.annotation.JsonProperty("storeActive")
    @Column(name = "store_active")
    private Boolean storeActive = true;
}
