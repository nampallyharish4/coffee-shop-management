package com.coffeeshop.service;

import com.coffeeshop.dto.InventoryItemDTO;
import com.coffeeshop.entity.InventoryItem;
import com.coffeeshop.exception.ResourceNotFoundException;
import com.coffeeshop.repository.InventoryItemRepository;
import com.coffeeshop.repository.InventoryUsageRepository;
import com.coffeeshop.dto.InventoryUsageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@SuppressWarnings("null")
public class InventoryService {
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private InventoryUsageRepository inventoryUsageRepository;

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

    public InventoryItemDTO getInventoryItemById(long id) {
        return inventoryItemRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
    }

    @Transactional
    public InventoryItemDTO createInventoryItem(InventoryItemDTO dto) {
        InventoryItem item = new InventoryItem();
        updateInventoryItemFromDTO(item, dto);
        InventoryItem saved = Objects.requireNonNull(inventoryItemRepository.save(item));
        return convertToDTO(saved);
    }

    @Transactional
    public InventoryItemDTO updateInventoryItem(long id, InventoryItemDTO dto) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        updateInventoryItemFromDTO(item, dto);
        InventoryItem saved = Objects.requireNonNull(inventoryItemRepository.save(item));
        return convertToDTO(saved);
    }

    @Transactional
    public InventoryItemDTO addStock(long id, InventoryItemDTO dto) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        item.setCurrentStock(item.getCurrentStock().add(dto.getCurrentStock()));
        InventoryItem saved = Objects.requireNonNull(inventoryItemRepository.save(item));
        return convertToDTO(saved);
    }

    public void deleteInventoryItem(long id) {
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
        item.setUnitPrice(dto.getUnitPrice() != null ? dto.getUnitPrice() : BigDecimal.ZERO);
    }

    public List<InventoryUsageDTO> getInventoryUsageHistory() {
        return inventoryUsageRepository.findAll(Sort.by(Sort.Direction.DESC, "usedAt")).stream()
                .map(usage -> new InventoryUsageDTO(
                        usage.getId(),
                        usage.getInventoryItem().getId(),
                        usage.getInventoryItem().getName(),
                        usage.getOrder().getId(),
                        usage.getQuantityUsed(),
                        usage.getTotalCost(),
                        usage.getUsedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void resetUsageHistory() {
        inventoryUsageRepository.deleteAll();
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
        dto.setUnitPrice(item.getUnitPrice());
        return dto;
    }
}
