package com.popobob.controller;

import com.popobob.dto.LoyaltyAnalyticsDto;
import com.popobob.repository.GuestRewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/loyalty")
@RequiredArgsConstructor
public class LoyaltyAdminController {

    private final GuestRewardRepository guestRewardRepository;

    @GetMapping("/analytics")
    public ResponseEntity<LoyaltyAnalyticsDto> getAnalytics() {
        long pending = guestRewardRepository.countByStatus("PENDING");
        long claimed = guestRewardRepository.countByStatus("CLAIMED");
        long expired = guestRewardRepository.countByStatus("EXPIRED");
        
        double conversionRate = 0.0;
        long totalCompleted = claimed + expired;
        if (totalCompleted > 0) {
            conversionRate = ((double) claimed / totalCompleted) * 100.0;
        }

        LoyaltyAnalyticsDto dto = new LoyaltyAnalyticsDto(pending, claimed, expired, conversionRate);
        return ResponseEntity.ok(dto);
    }
}
