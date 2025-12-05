package com.coffeeshop.service;

import com.coffeeshop.entity.Order;
import com.coffeeshop.repository.InventoryUsageRepository;
import com.coffeeshop.repository.OrderItemRepository;
import com.coffeeshop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private InventoryUsageRepository inventoryUsageRepository;

    public Map<String, Object> getSalesSummary(String range) {
        LocalDateTime[] dateRange = getDateRange(range);
        List<Order> orders = orderRepository.findByDateRange(dateRange[0], dateRange[1]);

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long orderCount = orders.stream()
                .filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED)
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("orderCount", orderCount);
        summary.put("averageOrderValue", orderCount > 0 ? totalRevenue.divide(new BigDecimal(orderCount), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO);
        summary.put("period", range);
        summary.put("startDate", dateRange[0]);
        summary.put("endDate", dateRange[1]);

        return summary;
    }

    public List<Map<String, Object>> getTopSellingItems(String range) {
        LocalDateTime[] dateRange = getDateRange(range);
        List<Object[]> results = orderItemRepository.findTopSellingItems(dateRange[0], dateRange[1]);

        return results.stream()
                .limit(10)
                .map(result -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("itemName", result[0]);
                    item.put("totalQuantity", result[1]);
                    return item;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getInventoryUsage(String range) {
        LocalDateTime[] dateRange = getDateRange(range);
        List<Object[]> results = inventoryUsageRepository.findUsageSummary(dateRange[0], dateRange[1]);

        return results.stream()
                .map(result -> {
                    Map<String, Object> usage = new HashMap<>();
                    usage.put("itemName", result[0]);
                    usage.put("totalUsed", result[1]);
                    return usage;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getStaffPerformance(String range) {
        LocalDateTime[] dateRange = getDateRange(range);
        List<Order> orders = orderRepository.findByDateRange(dateRange[0], dateRange[1]);

        Map<Long, Map<String, Object>> staffStats = new HashMap<>();

        for (Order order : orders) {
            Long cashierId = order.getCashier().getId();
            staffStats.putIfAbsent(cashierId, new HashMap<>());
            Map<String, Object> stats = staffStats.get(cashierId);
            
            stats.put("userId", cashierId);
            stats.put("userName", order.getCashier().getName());
            stats.put("orderCount", ((Long) stats.getOrDefault("orderCount", 0L)) + 1);
            
            if (order.getStatus() == Order.OrderStatus.COMPLETED) {
                BigDecimal revenue = (BigDecimal) stats.getOrDefault("totalRevenue", BigDecimal.ZERO);
                stats.put("totalRevenue", revenue.add(order.getTotal()));
            }
        }

        return staffStats.values().stream()
                .collect(Collectors.toList());
    }

    private LocalDateTime[] getDateRange(String range) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start;

        switch (range.toLowerCase()) {
            case "daily":
                start = end.minusDays(1);
                break;
            case "weekly":
                start = end.minusWeeks(1);
                break;
            case "monthly":
                start = end.minusMonths(1);
                break;
            default:
                start = end.minusDays(1);
        }

        return new LocalDateTime[]{start, end};
    }
}
