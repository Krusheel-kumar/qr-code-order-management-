package com.popobob.repository;

import com.popobob.model.GuestReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GuestRewardRepository extends JpaRepository<GuestReward, UUID> {
    List<GuestReward> findByPhoneNumberAndStatus(String phoneNumber, String status);
    
    Optional<GuestReward> findByOrderId(UUID orderId);

    List<GuestReward> findByStatusAndExpiresAtBefore(String status, LocalDateTime time);

    long countByStatus(String status);
}
