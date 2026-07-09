package com.popobob.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CustomizationOptionDto {
    @NotBlank(message = "ID is required")
    private String id;

    @NotBlank(message = "Group ID is required")
    private String groupId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Default price is required")
    @DecimalMin(value = "0.00", message = "Default price must be >= 0.00")
    private BigDecimal defaultPrice = BigDecimal.ZERO;

    private Boolean isAvailable = true;

    private Boolean badgeEnabled;
    private String badgeType;
    private String badgeColor;
    private String badgeIcon;
    private Integer badgePriority;
}
