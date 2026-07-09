package com.popobob.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;

@Data
public class OrderItemDto {
    private String productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private String specialInstructions;
    private String customizations;
    private List<CustomizationSelectionDto> customizationsList;
}
