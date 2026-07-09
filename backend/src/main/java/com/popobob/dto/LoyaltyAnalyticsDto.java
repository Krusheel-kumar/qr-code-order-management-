package com.popobob.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyAnalyticsDto {
    private long pendingCount;
    private long claimedCount;
    private long expiredCount;
    private double conversionRate;
}
