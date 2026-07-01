package com.popobob.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class OrderRequestDto {
    private String customerName;
    private String customerPhone;
    private String tableNumber;
    private String paymentReference;
    private String orderType;
    private Long storeId;
    private UUID userId;
    private Integer pointsUsed;
    private List<OrderItemDto> items;
}
