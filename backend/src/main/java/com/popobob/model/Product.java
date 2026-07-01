package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    
    private String name;
    private String description;
    private BigDecimal price;
    @com.fasterxml.jackson.annotation.JsonProperty("isAvailable")
    private Boolean isAvailable = true;
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    // Menu Display Flags
    @com.fasterxml.jackson.annotation.JsonProperty("isFeatured")
    private Boolean isFeatured = false;
    @com.fasterxml.jackson.annotation.JsonProperty("isBestseller")
    private Boolean isBestseller = false;
    @com.fasterxml.jackson.annotation.JsonProperty("isNewLaunch")
    private Boolean isNewLaunch = false;

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    public Boolean getIsBestseller() { return isBestseller; }
    public void setIsBestseller(Boolean isBestseller) { this.isBestseller = isBestseller; }
    public Boolean getIsNewLaunch() { return isNewLaunch; }
    public void setIsNewLaunch(Boolean isNewLaunch) { this.isNewLaunch = isNewLaunch; }
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
        name = "discovery_section_products",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "section_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("products")
    private List<DiscoverySection> discoverySections;

    @ElementCollection
    @BatchSize(size = 50)
    @CollectionTable(name = "product_eligible_addons", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "addon_id")
    private List<String> eligibleAddons;

    private String subcategory;
    private BigDecimal largePriceAddOn;
    
    @Column(length = 2000)
    private String story;
    
    private String mood;
    private String badge;
    private String staffPickNote;
    private Double rating;
    private Integer ordersToday;
    private Integer calories;
    
    @Embedded
    private FlavorProfile flavorProfile;
    
    @ElementCollection
    @BatchSize(size = 50)
    @CollectionTable(name = "product_flavor_notes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "flavor_note")
    private List<String> flavorNotes;
    
    @ElementCollection
    @BatchSize(size = 50)
    @CollectionTable(name = "product_pairings", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "pairing_id")
    private List<String> pairings;
    
    @ElementCollection
    @BatchSize(size = 50)
    @CollectionTable(name = "product_recommended_toppings", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "topping_id")
    private List<String> recommendedToppings;
}
