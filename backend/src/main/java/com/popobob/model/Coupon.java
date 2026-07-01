package com.POP O'BOB®.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    private String id;
    
    @Column(unique = true)
    private String code;
    
    private String type; // 'percentage' or 'flat'
    
    @Column(name = "coupon_value")
    private Double value;
    
    private Boolean active = true;
}
