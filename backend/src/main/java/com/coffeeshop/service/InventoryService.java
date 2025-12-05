package com.coffeeshop.service;

import com.coffeeshop.dto.InventoryItemDTO;
import com.coffeeshop.entity.InventoryItem;
import com.coffeeshop.exception.ResourceNotFoundException;
import com.coffeeshop.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    public List<InventoryItemDTO> getAllInventoryItems() {
        return inventoryItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryItemDTO> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryItemDTO> getOutOfStockItems() {
        return inventoryItemRepository.findOutOfStockItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InventoryItemDTO getInventoryItemById(Long id) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        return convertToDTO(item);
    }

    @Transactional
    public InventoryItemDTO createInventoryItem(InventoryItemDTO dto) {
        InventoryItem item = new InventoryItem();
        updateInventoryItemFromDTO(item, dto);
        InventoryItem saved = inventoryItemRepository.save(item);
        return convertToDTO(saved);
    }

    @Transactional
    public InventoryItemDTO updateInventoryItem(Long id, InventoryItemDTO dto) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        updateInventoryItemFromDTO(item, dto);
        InventoryItem updated = inventoryItemRepository.save(item);
        return convertToDTO(updated);
    }

    @Transactional
    public InventoryItemDTO addStock(Long id, InventoryItemDTO dto) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        item.setCurrentStock(item.getCurrentStock().add(dto.getCurrentStock()));
        InventoryItem updated = inventoryItemRepository.save(item);
        return convertToDTO(updated);
    }

    public void deleteInventoryItem(Long id) {
        if (!inventoryItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventory item not found");
        }
        inventoryItemRepository.deleteById(id);
    }

    private void updateInventoryItemFromDTO(InventoryItem item, InventoryItemDTO dto) {
        item.setName(dto.getName());
        item.setUnit(dto.getUnit());
        item.setCurrentStock(dto.getCurrentStock());
        item.setReorderLevel(dto.getReorderLevel());
    }

    private InventoryItemDTO convertToDTO(InventoryItem item) {
        InventoryItemDTO dto = new InventoryItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setUnit(item.getUnit());
        dto.setCurrentStock(item.getCurrentStock());
        dto.setReorderLevel(item.getReorderLevel());
        dto.setLowStock(item.isLowStock());
        dto.setOutOfStock(item.isOutOfStock());
        return dto;
    }
}
