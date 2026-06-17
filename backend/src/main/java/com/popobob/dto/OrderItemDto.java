package com.popobob.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class OrderItemDto {
    private String productId;
    private Integer quantity;
    private BigDecimal subtotal;
    private String specialInstructions;
}
