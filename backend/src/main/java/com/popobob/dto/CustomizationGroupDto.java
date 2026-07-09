package com.popobob.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomizationGroupDto {
    @NotBlank(message = "ID is required")
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Min selections is required")
    @Min(value = 0, message = "Min selections must be >= 0")
    private Integer minSelections = 0;

    @NotNull(message = "Max selections is required")
    @Min(value = 0, message = "Max selections must be >= 0")
    private Integer maxSelections = 1;

    @NotNull(message = "Free selections limit is required")
    @Min(value = 0, message = "Free selections limit must be >= 0")
    private Integer freeSelectionsLimit = 0;

    private Boolean isRequired = false;
}
