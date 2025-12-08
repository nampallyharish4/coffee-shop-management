package com.coffeeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryUsageDTO {
    private Long id;
    private Long inventoryItemId;
    private String inventoryItemName;
    private Long orderId;
    private BigDecimal quantityUsed;
    private BigDecimal totalCost;
    private LocalDateTime usedAt;
}
