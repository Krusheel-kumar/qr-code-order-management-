package com.POP O'BOB®.repository;

import com.POP O'BOB®.model.Addon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddonRepository extends JpaRepository<Addon, String> {
}
