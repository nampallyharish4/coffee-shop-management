package com.coffeeshop.controller;

import com.coffeeshop.dto.ApiResponse;
import com.coffeeshop.dto.OrderDTO;
import com.coffeeshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management", description = "Order management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    @Operation(summary = "Get all orders")
    public ResponseEntity<ApiResponse> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", orders));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status")
    public ResponseEntity<ApiResponse> getOrdersByStatus(@PathVariable String status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<ApiResponse> getOrderById(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Order retrieved successfully", order));
    }

    @PostMapping
    @Operation(summary = "Create new order")
    public ResponseEntity<ApiResponse> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        OrderDTO created = orderService.createOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Order created successfully", created));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<ApiResponse> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        OrderDTO updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Order status updated successfully", updated));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel order")
    public ResponseEntity<ApiResponse> cancelOrder(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        OrderDTO cancelled = orderService.cancelOrder(id, reason);
        return ResponseEntity.ok(new ApiResponse(true, "Order cancelled successfully", cancelled));
    }

    @PostMapping("/reset-revenue")
    @Operation(summary = "Reset revenue by canceling all completed orders")
    public ResponseEntity<ApiResponse> resetRevenue() {
        int cancelledCount = orderService.resetRevenue();
        return ResponseEntity.ok(new ApiResponse(true, 
            "Revenue reset successfully. " + cancelledCount + " orders cancelled.", 
            cancelledCount));
    }
}
