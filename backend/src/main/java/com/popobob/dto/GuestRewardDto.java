package com.popobob.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class GuestRewardDto {
    private UUID id;
    private UUID orderId;
    private Integer points;
    private String status;
    private LocalDateTime expiresAt;
}
