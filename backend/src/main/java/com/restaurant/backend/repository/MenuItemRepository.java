package com.restaurant.backend.repository;

import com.restaurant.backend.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByRestaurantIdOrderByCategoryAscNameAsc(String restaurantId);
    List<MenuItem> findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(String restaurantId);
}
