package com.popobob.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class FlavorProfile {
    private Integer sweetness;
    private Integer bitterness;
    private Integer acidity;
    private Integer intensity;
}
