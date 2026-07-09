package com.popobob.service;

import com.popobob.model.GuestReward;
import com.popobob.repository.GuestRewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoyaltyCleanupTask {

    private final GuestRewardRepository guestRewardRepository;

    @Scheduled(cron = "${guest.reward.cleanup-cron:0 0 * * * *}")
    @Transactional
    public void cleanupExpiredRewards() {
        LocalDateTime now = LocalDateTime.now();
        List<GuestReward> expiredRewards = guestRewardRepository.findByStatusAndExpiresAtBefore("PENDING", now);
        
        if (!expiredRewards.isEmpty()) {
            for (GuestReward reward : expiredRewards) {
                reward.setStatus("EXPIRED");
            }
            guestRewardRepository.saveAll(expiredRewards);
        }
    }
}
