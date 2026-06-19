package com.popobob.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "campaigns")
public class Campaign {
    @Id
    private String id;
    
    private String title;
    private String subtitle;
    private String image;
    private String badge;
    private String ctaText;
    private String link;
}
