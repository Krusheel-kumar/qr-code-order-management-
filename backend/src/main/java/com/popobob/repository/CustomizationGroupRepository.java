package com.popobob.repository;

import com.popobob.model.CustomizationGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomizationGroupRepository extends JpaRepository<CustomizationGroup, String> {
}
