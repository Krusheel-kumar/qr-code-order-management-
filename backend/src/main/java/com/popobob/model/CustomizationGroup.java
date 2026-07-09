package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "customization_groups")
public class CustomizationGroup {
    @Id
    private String id;
    
    private String name;
    
    @Column(name = "min_selections", nullable = false)
    private Integer minSelections = 0;
    
    @Column(name = "max_selections", nullable = false)
    private Integer maxSelections = 1;
    
    @Column(name = "free_selections_limit", nullable = false)
    private Integer freeSelectionsLimit = 0;
    
    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomizationOption> options = new ArrayList<>();
    
    @Version
    private Integer version = 0;
}
