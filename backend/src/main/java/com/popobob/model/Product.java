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
    
    @Version
    private Integer version = 0;
    
    private String name;
    private String description;
    private BigDecimal price;
    @com.fasterxml.jackson.annotation.JsonProperty("isAvailable")
    private Boolean isAvailable = true;
    @com.fasterxml.jackson.annotation.JsonProperty("image")
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

    @ManyToMany
    @JoinTable(
        name = "menu_item_customizations",
        joinColumns = @JoinColumn(name = "menu_item_id"),
        inverseJoinColumns = @JoinColumn(name = "customization_group_id")
    )
    @OrderColumn(name = "display_order")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("products")
    @org.hibernate.annotations.BatchSize(size = 50)
    private List<CustomizationGroup> customizationGroups;

    @ManyToMany
    @JoinTable(
        name = "combo_structure",
        joinColumns = @JoinColumn(name = "parent_product_id"),
        inverseJoinColumns = @JoinColumn(name = "child_product_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("parentProducts")
    private List<Product> comboItems;

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
