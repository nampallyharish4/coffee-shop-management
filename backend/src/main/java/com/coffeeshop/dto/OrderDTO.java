package com.coffeeshop.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long cashierId;
    private String cashierName;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal total;
    private String couponCode;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    @NotEmpty(message = "Order must have at least one item")
    private List<OrderItemDTO> items;
    
    private PaymentDTO payment;
    
    @Data
    public static class OrderItemDTO {
        @NotNull(message = "Menu item ID is required")
        private Long menuItemId;
        
        private String menuItemName;
        private BigDecimal price;
        
        @NotNull(message = "Quantity is required")
        private Integer quantity;
        
        private BigDecimal subtotal;
    }
    
    @Data
    public static class PaymentDTO {
        @NotNull(message = "Payment method is required")
        private String method;
        
        @NotNull(message = "Amount is required")
        private BigDecimal amount;
        
        private String transactionId;
    }
}
