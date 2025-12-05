package com.coffeeshop.service;

import com.coffeeshop.dto.OrderDTO;
import com.coffeeshop.entity.*;
import com.coffeeshop.exception.ResourceNotFoundException;
import com.coffeeshop.repository.*;
import com.coffeeshop.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private InventoryUsageRepository inventoryUsageRepository;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.05"); // 5% tax

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(String status) {
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status);
        return orderRepository.findByStatus(orderStatus).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO createOrder(OrderDTO dto) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        
        User cashier = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = new Order();
        order.setCashier(cashier);
        order.setStatus(Order.OrderStatus.CREATED);

        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (OrderDTO.OrderItemDTO itemDTO : dto.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemDTO.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setSubtotal(menuItem.getPrice().multiply(new BigDecimal(itemDTO.getQuantity())));
            
            order.getItems().add(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());
        }

        order.setSubtotal(subtotal);
        order.setDiscount(dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO);
        order.setCouponCode(dto.getCouponCode());
        
        BigDecimal taxableAmount = subtotal.subtract(order.getDiscount());
        order.setTax(taxableAmount.multiply(TAX_RATE));
        order.setTotal(taxableAmount.add(order.getTax()));

        if (dto.getPayment() != null) {
            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setMethod(Payment.PaymentMethod.valueOf(dto.getPayment().getMethod()));
            payment.setAmount(order.getTotal());
            payment.setTransactionId(dto.getPayment().getTransactionId());
            order.setPayment(payment);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status);
        order.setStatus(newStatus);

        if (newStatus == Order.OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
            deductInventory(order);
        }

        Order updated = orderRepository.save(order);
        return convertToDTO(updated);
    }

    @Transactional
    public OrderDTO cancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(reason);

        Order updated = orderRepository.save(order);
        return convertToDTO(updated);
    }

    private void deductInventory(Order order) {
        for (OrderItem orderItem : order.getItems()) {
            MenuItem menuItem = menuItemRepository.findByIdWithIngredients(orderItem.getMenuItem().getId());
            
            if (menuItem.getIngredients() != null) {
                for (MenuIngredient ingredient : menuItem.getIngredients()) {
                    InventoryItem inventoryItem = ingredient.getInventoryItem();
                    BigDecimal totalRequired = ingredient.getQuantityRequired()
                            .multiply(new BigDecimal(orderItem.getQuantity()));
                    
                    inventoryItem.setCurrentStock(inventoryItem.getCurrentStock().subtract(totalRequired));
                    inventoryItemRepository.save(inventoryItem);

                    InventoryUsage usage = new InventoryUsage();
                    usage.setOrder(order);
                    usage.setInventoryItem(inventoryItem);
                    usage.setQuantityUsed(totalRequired);
                    inventoryUsageRepository.save(usage);
                }
            }
        }
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCashierId(order.getCashier().getId());
        dto.setCashierName(order.getCashier().getName());
        dto.setStatus(order.getStatus().name());
        dto.setSubtotal(order.getSubtotal());
        dto.setDiscount(order.getDiscount());
        dto.setTax(order.getTax());
        dto.setTotal(order.getTotal());
        dto.setCouponCode(order.getCouponCode());
        dto.setCancellationReason(order.getCancellationReason());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setCompletedAt(order.getCompletedAt());

        List<OrderDTO.OrderItemDTO> items = order.getItems().stream()
                .map(item -> {
                    OrderDTO.OrderItemDTO itemDTO = new OrderDTO.OrderItemDTO();
                    itemDTO.setMenuItemId(item.getMenuItem().getId());
                    itemDTO.setMenuItemName(item.getMenuItem().getName());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setSubtotal(item.getSubtotal());
                    return itemDTO;
                })
                .collect(Collectors.toList());
        dto.setItems(items);

        if (order.getPayment() != null) {
            OrderDTO.PaymentDTO paymentDTO = new OrderDTO.PaymentDTO();
            paymentDTO.setMethod(order.getPayment().getMethod().name());
            paymentDTO.setAmount(order.getPayment().getAmount());
            paymentDTO.setTransactionId(order.getPayment().getTransactionId());
            dto.setPayment(paymentDTO);
        }

        return dto;
    }
}
