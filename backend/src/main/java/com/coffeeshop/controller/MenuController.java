package com.coffeeshop.controller;

import com.coffeeshop.dto.ApiResponse;
import com.coffeeshop.dto.MenuItemDTO;
import com.coffeeshop.service.MenuService;
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
@RequestMapping("/api/menu")
@Tag(name = "Menu Management", description = "Menu management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping
    @Operation(summary = "Get all menu items")
    public ResponseEntity<ApiResponse> getAllMenuItems() {
        List<MenuItemDTO> items = menuService.getAllMenuItems();
        return ResponseEntity.ok(new ApiResponse(true, "Menu items retrieved successfully", items));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active menu items")
    public ResponseEntity<ApiResponse> getActiveMenuItems() {
        List<MenuItemDTO> items = menuService.getActiveMenuItems();
        return ResponseEntity.ok(new ApiResponse(true, "Active menu items retrieved successfully", items));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID")
    public ResponseEntity<ApiResponse> getMenuItemById(@PathVariable Long id) {
        MenuItemDTO item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Menu item retrieved successfully", item));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new menu item")
    public ResponseEntity<ApiResponse> createMenuItem(@Valid @RequestBody MenuItemDTO menuItemDTO) {
        MenuItemDTO created = menuService.createMenuItem(menuItemDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Menu item created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update menu item")
    public ResponseEntity<ApiResponse> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemDTO menuItemDTO) {
        MenuItemDTO updated = menuService.updateMenuItem(id, menuItemDTO);
        return ResponseEntity.ok(new ApiResponse(true, "Menu item updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete menu item")
    public ResponseEntity<ApiResponse> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Menu item deleted successfully"));
    }
}
