package com.coffeeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InventoryItemDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Unit is required")
    private String unit;
    
    @NotNull(message = "Current stock is required")
    @PositiveOrZero(message = "Stock cannot be negative")
    private BigDecimal currentStock;
    
    @NotNull(message = "Reorder level is required")
    @PositiveOrZero(message = "Reorder level cannot be negative")
    private BigDecimal reorderLevel;
    
    private Boolean lowStock;
    private Boolean outOfStock;
}
