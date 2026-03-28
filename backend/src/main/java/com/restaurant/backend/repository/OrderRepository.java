package com.restaurant.backend.repository;

import com.restaurant.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByUserIdAndRestaurantId(String userId, String restaurantId);
    List<Order> findByUserIdAndRestaurantIdOrderByCreatedAtDesc(String userId, String restaurantId);
    List<Order> findByTableId(String tableId);
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);
    List<Order> findByRestaurantIdAndCreatedAtBetween(String restaurantId, LocalDateTime start, LocalDateTime end);
    List<Order> findAllByOrderByCreatedAtDesc();
}
