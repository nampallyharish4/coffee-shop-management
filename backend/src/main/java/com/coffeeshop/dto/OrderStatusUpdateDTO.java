package com.coffeeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(PENDING|IN_PREPARATION|READY|COMPLETED|CANCELLED)$", 
             message = "Status must be one of: PENDING, IN_PREPARATION, READY, COMPLETED, CANCELLED")
    private String status;
}
