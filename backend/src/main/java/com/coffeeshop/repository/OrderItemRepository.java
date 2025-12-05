package com.coffeeshop.repository;

import com.coffeeshop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi.menuItem.name, SUM(oi.quantity) as totalQuantity " +
           "FROM OrderItem oi " +
           "WHERE oi.order.createdAt BETWEEN :start AND :end " +
           "GROUP BY oi.menuItem.id, oi.menuItem.name " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> findTopSellingItems(@Param("start") LocalDateTime start, 
                                       @Param("end") LocalDateTime end);
}
