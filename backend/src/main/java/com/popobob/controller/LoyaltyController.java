package com.popobob.controller;

import com.popobob.dto.GuestRewardDto;
import com.popobob.model.GuestReward;
import com.popobob.repository.GuestRewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final GuestRewardRepository guestRewardRepository;

    @GetMapping("/guest/order/{orderId}")
    public ResponseEntity<GuestRewardDto> getGuestRewardByOrderId(@PathVariable UUID orderId) {
        Optional<GuestReward> rewardOpt = guestRewardRepository.findByOrderId(orderId);
        
        if (rewardOpt.isPresent()) {
            GuestReward reward = rewardOpt.get();
            GuestRewardDto dto = new GuestRewardDto();
            dto.setId(reward.getId());
            dto.setOrderId(reward.getOrderId());
            dto.setPoints(reward.getPoints());
            dto.setStatus(reward.getStatus());
            dto.setExpiresAt(reward.getExpiresAt());
            return ResponseEntity.ok(dto);
        }
        
        return ResponseEntity.notFound().build();
    }
}
