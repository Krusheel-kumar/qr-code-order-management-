package com.popobob.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class OrderRequestDto {
    private String tableId;
    private List<OrderItemDto> items;
}
