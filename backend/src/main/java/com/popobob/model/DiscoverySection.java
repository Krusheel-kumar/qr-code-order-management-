package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "discovery_sections")
public class DiscoverySection {
    @Id
    private String id;
    
    private String title;
    private Integer displayOrder = 0;
    private Boolean isActive = true;

    @ManyToMany(mappedBy = "discoverySections")
    @JsonIgnoreProperties({"discoverySections", "category", "eligibleAddons", "flavorNotes", "pairings", "recommendedToppings"})
    private List<Product> products = new ArrayList<>();
}
