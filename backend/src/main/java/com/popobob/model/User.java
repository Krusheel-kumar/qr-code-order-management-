package com.POP O'BOB®.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String username;
    private String passwordHash;
    private String email;
    private String phoneNumber;
    private String role;
    private Integer loyaltyPoints = 0;
}
