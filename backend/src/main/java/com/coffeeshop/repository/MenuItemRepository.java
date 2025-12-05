package com.coffeeshop.repository;

import com.coffeeshop.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByActiveTrue();
    List<MenuItem> findByCategoryId(Long categoryId);
    
    @Query("SELECT m FROM MenuItem m LEFT JOIN FETCH m.ingredients WHERE m.id = :id")
    MenuItem findByIdWithIngredients(Long id);
}
