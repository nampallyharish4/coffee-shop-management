package com.coffeeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InventoryItemDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Unit is required")
    @Size(min = 1, max = 20, message = "Unit must be between 1 and 20 characters")
    private String unit;
    
    @NotNull(message = "Current stock is required")
    @PositiveOrZero(message = "Stock cannot be negative")
    private BigDecimal currentStock;
    
    @NotNull(message = "Reorder level is required")
    @PositiveOrZero(message = "Reorder level cannot be negative")
    private BigDecimal reorderLevel;
    
    private Boolean lowStock;
    private Boolean outOfStock;

    @PositiveOrZero(message = "Unit price cannot be negative")
    private BigDecimal unitPrice;
}
