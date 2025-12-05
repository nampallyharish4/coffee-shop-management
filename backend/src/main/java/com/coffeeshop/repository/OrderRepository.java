package com.coffeeshop.repository;

import com.coffeeshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    List<Order> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT o FROM Order o WHERE o.cashier.id = :cashierId AND o.createdAt BETWEEN :start AND :end")
    List<Order> findByCashierAndDateRange(@Param("cashierId") Long cashierId, 
                                          @Param("start") LocalDateTime start, 
                                          @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.cashier.id = :userId AND o.createdAt BETWEEN :start AND :end")
    Long countOrdersByUserAndDateRange(@Param("userId") Long userId, 
                                       @Param("start") LocalDateTime start, 
                                       @Param("end") LocalDateTime end);
}
