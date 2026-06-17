package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "tables")
public class CafeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private Integer tableNumber;
    private String qrCodeUrl;
    private String status;
}
