package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "stories")
public class Story {
    @Id
    private String id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String image;
    private String badge;
}
