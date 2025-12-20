package com.coffeeshop.service;

import com.coffeeshop.dto.MenuItemDTO;
import com.coffeeshop.entity.Category;
import com.coffeeshop.entity.InventoryItem;
import com.coffeeshop.entity.MenuIngredient;
import com.coffeeshop.entity.MenuItem;
import com.coffeeshop.exception.ResourceNotFoundException;
import com.coffeeshop.repository.CategoryRepository;
import com.coffeeshop.repository.InventoryItemRepository;
import com.coffeeshop.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@SuppressWarnings("null")
public class MenuService {
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    public List<MenuItemDTO> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MenuItemDTO> getActiveMenuItems() {
        return menuItemRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MenuItemDTO getMenuItemById(long id) {
        return menuItemRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
    }

    @Transactional
    public MenuItemDTO createMenuItem(MenuItemDTO dto) {
        MenuItem menuItem = new MenuItem();
        updateMenuItemFromDTO(menuItem, dto);
        MenuItem saved = Objects.requireNonNull(menuItemRepository.save(menuItem));
        return convertToDTO(saved);
    }

    @Transactional
    public MenuItemDTO updateMenuItem(long id, MenuItemDTO dto) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        updateMenuItemFromDTO(menuItem, dto);
        MenuItem saved = Objects.requireNonNull(menuItemRepository.save(menuItem));
        return convertToDTO(saved);
    }

    public void deleteMenuItem(long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found");
        }
        menuItemRepository.deleteById(id);
    }

    private void updateMenuItemFromDTO(MenuItem menuItem, MenuItemDTO dto) {
        menuItem.setName(dto.getName());
        menuItem.setPrice(dto.getPrice());
        menuItem.setDescription(dto.getDescription());
        menuItem.setImageUrl(dto.getImageUrl());
        menuItem.setActive(dto.getActive() != null ? dto.getActive() : true);

        Long categoryId = Objects.requireNonNull(dto.getCategoryId(), "Category ID is required");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        menuItem.setCategory(category);

        // If it's a new menu item, save it first to get an ID before adding ingredients
        if (menuItem.getId() == null) {
            menuItem = Objects.requireNonNull(menuItemRepository.save(menuItem));
        }

        if (dto.getIngredients() != null && menuItem != null) {
            menuItem.getIngredients().clear();
            for (MenuItemDTO.IngredientDTO ingredientDTO : dto.getIngredients()) {
                InventoryItem inventoryItem = null;

                Long inventoryItemId = ingredientDTO.getInventoryItemId();
                if (inventoryItemId != null) {
                   inventoryItem = inventoryItemRepository.findById(inventoryItemId)
                           .orElse(null);
                }

                if (inventoryItem == null && ingredientDTO.getInventoryItemName() != null) {
                    inventoryItem = inventoryItemRepository.findByName(ingredientDTO.getInventoryItemName())
                            .orElse(null);
                }

                if (inventoryItem == null && ingredientDTO.getInventoryItemName() != null) {
                    InventoryItem newItem = new InventoryItem();
                    newItem.setName(ingredientDTO.getInventoryItemName());
                    newItem.setUnit(ingredientDTO.getUnit() != null ? ingredientDTO.getUnit() : "unit");
                    newItem.setCurrentStock(BigDecimal.ZERO);
                    newItem.setReorderLevel(BigDecimal.TEN);
                    newItem.setUnitPrice(BigDecimal.ZERO);
                    inventoryItem = Objects.requireNonNull(inventoryItemRepository.save(newItem));
                }

                if (inventoryItem != null) {
                    MenuIngredient ingredient = new MenuIngredient();
                    ingredient.setMenuItem(menuItem);
                    ingredient.setInventoryItem(inventoryItem);
                    ingredient.setQuantityRequired(ingredientDTO.getQuantityRequired());
                    menuItem.getIngredients().add(ingredient);
                }
            }
        }
    }

    private MenuItemDTO convertToDTO(MenuItem menuItem) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(menuItem.getId());
        dto.setName(menuItem.getName());
        dto.setCategoryId(menuItem.getCategory().getId());
        dto.setCategoryName(menuItem.getCategory().getName());
        dto.setPrice(menuItem.getPrice());
        dto.setDescription(menuItem.getDescription());
        dto.setImageUrl(menuItem.getImageUrl());
        dto.setActive(menuItem.getActive());

        if (menuItem.getIngredients() != null) {
            List<MenuItemDTO.IngredientDTO> ingredients = menuItem.getIngredients().stream()
                    .map(ing -> {
                        MenuItemDTO.IngredientDTO ingDTO = new MenuItemDTO.IngredientDTO();
                        ingDTO.setInventoryItemId(ing.getInventoryItem().getId());
                        ingDTO.setInventoryItemName(ing.getInventoryItem().getName());
                        ingDTO.setQuantityRequired(ing.getQuantityRequired());
                        ingDTO.setUnit(ing.getInventoryItem().getUnit());
                        return ingDTO;
                    })
                    .collect(Collectors.toList());
            dto.setIngredients(ingredients);
        }

        return dto;
    }
}
