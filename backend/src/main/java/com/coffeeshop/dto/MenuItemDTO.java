package com.coffeeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MenuItemDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    private String categoryName;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private String description;
    private String imageUrl;
    private Boolean active;
    private List<IngredientDTO> ingredients;
    
    @Data
    public static class IngredientDTO {
        private Long inventoryItemId;
        private String inventoryItemName;
        private BigDecimal quantityRequired;
        private String unit;
    }
}
