package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    private String id;
    
    private String name;
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "category_subcategories", joinColumns = @JoinColumn(name = "category_id"))
    @Column(name = "subcategory")
    private java.util.List<String> subcategories = new java.util.ArrayList<>();
}
