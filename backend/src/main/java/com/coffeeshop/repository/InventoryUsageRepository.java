package com.coffeeshop.repository;

import com.coffeeshop.entity.InventoryUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryUsageRepository extends JpaRepository<InventoryUsage, Long> {
    @Query("SELECT iu.inventoryItem.name, SUM(iu.quantityUsed) " +
           "FROM InventoryUsage iu " +
           "WHERE iu.usedAt BETWEEN :start AND :end " +
           "GROUP BY iu.inventoryItem.id, iu.inventoryItem.name")
    List<Object[]> findUsageSummary(@Param("start") LocalDateTime start, 
                                    @Param("end") LocalDateTime end);
}
