package com.restaurant.backend.repository;

import com.restaurant.backend.model.RestaurantTable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TableRepository extends MongoRepository<RestaurantTable, String> {
    List<RestaurantTable> findByIsOccupiedFalse();
    List<RestaurantTable> findByRestaurantIdOrderByTableNumberAsc(String restaurantId);
    List<RestaurantTable> findByRestaurantIdAndIsOccupiedFalse(String restaurantId);
}
