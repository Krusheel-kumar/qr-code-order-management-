package com.POP O'BOB®.model;

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
}
