package com.popobob.repository;

import com.popobob.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {
    java.util.Optional<Coupon> findByCodeIgnoreCase(String code);
}
