package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "guest_rewards")
public class GuestReward {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false)
    private String phoneNumber;

    private String guestName;

    @Column(nullable = false)
    private Integer points;

    // PENDING, CLAIMED, EXPIRED
    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime claimedAt;

    private UUID userId; // Populated when claimed
}
