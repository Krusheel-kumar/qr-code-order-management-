package com.POP O'BOB®.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "addons")
public class Addon {
    @Id
    private String id;
    
    private String name;
    private BigDecimal price;
    private Boolean isActive = true;
}
