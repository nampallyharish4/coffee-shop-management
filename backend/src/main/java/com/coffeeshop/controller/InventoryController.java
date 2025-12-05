package com.coffeeshop.controller;

import com.coffeeshop.dto.ApiResponse;
import com.coffeeshop.dto.InventoryItemDTO;
import com.coffeeshop.service.InventoryService;
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

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory Management", description = "Inventory management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Get all inventory items")
    public ResponseEntity<ApiResponse> getAllInventoryItems() {
        List<InventoryItemDTO> items = inventoryService.getAllInventoryItems();
        return ResponseEntity.ok(new ApiResponse(true, "Inventory items retrieved successfully", items));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Get low stock items")
    public ResponseEntity<ApiResponse> getLowStockItems() {
        List<InventoryItemDTO> items = inventoryService.getLowStockItems();
        return ResponseEntity.ok(new ApiResponse(true, "Low stock items retrieved successfully", items));
    }

    @GetMapping("/out-of-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Get out of stock items")
    public ResponseEntity<ApiResponse> getOutOfStockItems() {
        List<InventoryItemDTO> items = inventoryService.getOutOfStockItems();
        return ResponseEntity.ok(new ApiResponse(true, "Out of stock items retrieved successfully", items));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Get inventory item by ID")
    public ResponseEntity<ApiResponse> getInventoryItemById(@PathVariable Long id) {
        InventoryItemDTO item = inventoryService.getInventoryItemById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Inventory item retrieved successfully", item));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Create new inventory item")
    public ResponseEntity<ApiResponse> createInventoryItem(@Valid @RequestBody InventoryItemDTO inventoryItemDTO) {
        InventoryItemDTO created = inventoryService.createInventoryItem(inventoryItemDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Inventory item created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Update inventory item")
    public ResponseEntity<ApiResponse> updateInventoryItem(@PathVariable Long id, @Valid @RequestBody InventoryItemDTO inventoryItemDTO) {
        InventoryItemDTO updated = inventoryService.updateInventoryItem(id, inventoryItemDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Inventory item updated successfully", updated));
    }

    @PostMapping("/{id}/add-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Add stock to inventory item")
    public ResponseEntity<ApiResponse> addStock(@PathVariable Long id, @RequestBody InventoryItemDTO inventoryItemDTO) {
        InventoryItemDTO updated = inventoryService.addStock(id, inventoryItemDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Stock added successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER')")
    @Operation(summary = "Delete inventory item")
    public ResponseEntity<ApiResponse> deleteInventoryItem(@PathVariable Long id) {
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Inventory item deleted successfully"));
    }
}
