package com.popobob.service;

import com.popobob.model.GuestReward;
import com.popobob.model.Order;
import com.popobob.model.User;
import com.popobob.repository.GuestRewardRepository;
import com.popobob.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final GuestRewardRepository guestRewardRepository;
    private final UserRepository userRepository;

    @Value("${guest.reward.enabled:true}")
    private boolean guestRewardEnabled;

    @Value("${guest.reward.expiry-hours:24}")
    private int guestRewardExpiryHours;

    @Transactional
    public void processOrderLoyalty(Order order) {
        if (order.getTotalAmount() == null) return;

        int currentPoints = 0;
        double multiplier = 1.0;
        User user = order.getUser();

        if (user != null) {
            currentPoints = user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints();
            if (currentPoints >= 2000) multiplier = 1.5; // Gold
            else if (currentPoints >= 500) multiplier = 1.2; // Silver
        }

        int basePoints = order.getTotalAmount().divideToIntegralValue(new BigDecimal("10")).intValue();
        int earnedPoints = (int) (basePoints * multiplier);

        if (earnedPoints > 0) {
            if (user != null) {
                // Registered User - add points directly
                user.setLoyaltyPoints(currentPoints + earnedPoints);
                userRepository.save(user);
            } else if (guestRewardEnabled && order.getCustomerPhone() != null && !order.getCustomerPhone().isEmpty()) {
                // Guest User - store as pending reward
                GuestReward gr = new GuestReward();
                gr.setOrderId(order.getId());
                gr.setPhoneNumber(order.getCustomerPhone());
                gr.setGuestName(order.getCustomerName());
                gr.setPoints(earnedPoints);
                gr.setStatus("PENDING");
                gr.setExpiresAt(LocalDateTime.now().plusHours(guestRewardExpiryHours));
                guestRewardRepository.save(gr);
            }
        }
    }

    @Transactional
    public void claimGuestRewards(String phoneNumber, User user) {
        if (!guestRewardEnabled || phoneNumber == null || phoneNumber.isEmpty()) return;

        List<GuestReward> pendingRewards = guestRewardRepository.findByPhoneNumberAndStatus(phoneNumber, "PENDING");
        if (pendingRewards.isEmpty()) return;

        int totalPointsToClaim = 0;
        LocalDateTime now = LocalDateTime.now();

        for (GuestReward reward : pendingRewards) {
            if (reward.getExpiresAt().isAfter(now)) {
                reward.setStatus("CLAIMED");
                reward.setClaimedAt(now);
                reward.setUserId(user.getId());
                totalPointsToClaim += reward.getPoints();
            } else {
                reward.setStatus("EXPIRED");
            }
        }

        if (totalPointsToClaim > 0) {
            int currentPoints = user.getLoyaltyPoints() == null ? 0 : user.getLoyaltyPoints();
            user.setLoyaltyPoints(currentPoints + totalPointsToClaim);
            userRepository.save(user);
        }
        
        guestRewardRepository.saveAll(pendingRewards);
    }
}
