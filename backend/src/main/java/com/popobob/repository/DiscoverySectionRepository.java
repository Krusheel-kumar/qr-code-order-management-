package com.popobob.repository;

import com.popobob.model.DiscoverySection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscoverySectionRepository extends JpaRepository<DiscoverySection, String> {
    List<DiscoverySection> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);
    List<DiscoverySection> findAllByOrderByDisplayOrderAsc();
}
