package com.POP O'BOB®.repository;

import com.POP O'BOB®.model.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    
    @EntityGraph(attributePaths = {"category"})
    List<Product> findByIsAvailableTrue();
    
    @EntityGraph(attributePaths = {"category"})
    List<Product> findAll();
}
