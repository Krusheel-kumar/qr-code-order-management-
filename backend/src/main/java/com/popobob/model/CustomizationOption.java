package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "customization_options")
public class CustomizationOption {
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CustomizationGroup group;

    @com.fasterxml.jackson.annotation.JsonProperty("groupId")
    public String getGroupId() {
        return group != null ? group.getId() : null;
    }
    
    private String name;
    
    @Column(name = "default_price", nullable = false)
    private BigDecimal defaultPrice = BigDecimal.ZERO;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Version
    private Integer version = 0;
}
