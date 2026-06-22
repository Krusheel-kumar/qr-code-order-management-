package com.popobob.repository;

import com.popobob.model.OrderSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderSequenceRepository extends JpaRepository<OrderSequence, String> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM OrderSequence s WHERE s.id = 'ORDER_SEQ'")
    Optional<OrderSequence> findAndLockById();
}
