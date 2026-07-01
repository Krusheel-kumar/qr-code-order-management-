package com.POP O'BOB®.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "order_sequence")
public class OrderSequence {
    @Id
    private String id = "ORDER_SEQ";
    
    private Long nextVal = 1000L;
}
