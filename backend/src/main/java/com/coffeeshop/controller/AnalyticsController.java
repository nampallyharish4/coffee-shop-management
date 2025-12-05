package com.coffeeshop.controller;

import com.coffeeshop.dto.ApiResponse;
import com.coffeeshop.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Analytics and reporting endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get sales summary")
    public ResponseEntity<ApiResponse> getSalesSummary(@RequestParam(defaultValue = "daily") String range) {
        Map<String, Object> summary = analyticsService.getSalesSummary(range);
        return ResponseEntity.ok(new ApiResponse(true, "Sales summary retrieved successfully", summary));
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get top selling items")
    public ResponseEntity<ApiResponse> getTopSellingItems(@RequestParam(defaultValue = "daily") String range) {
        List<Map<String, Object>> items = analyticsService.getTopSellingItems(range);
        return ResponseEntity.ok(new ApiResponse(true, "Top selling items retrieved successfully", items));
    }

    @GetMapping("/inventory-usage")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get inventory usage")
    public ResponseEntity<ApiResponse> getInventoryUsage(@RequestParam(defaultValue = "daily") String range) {
        List<Map<String, Object>> usage = analyticsService.getInventoryUsage(range);
        return ResponseEntity.ok(new ApiResponse(true, "Inventory usage retrieved successfully", usage));
    }

    @GetMapping("/staff-performance")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get staff performance metrics")
    public ResponseEntity<ApiResponse> getStaffPerformance(@RequestParam(defaultValue = "daily") String range) {
        List<Map<String, Object>> performance = analyticsService.getStaffPerformance(range);
        return ResponseEntity.ok(new ApiResponse(true, "Staff performance retrieved successfully", performance));
    }
}
