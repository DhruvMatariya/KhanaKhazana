package com.restaurant.backend.repository;

import com.restaurant.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByMenuItemIdOrderByCreatedAtDesc(String menuItemId);
    List<Review> findByUserIdAndRestaurantId(String userId, String restaurantId);
    long countByMenuItemId(String menuItemId);
    Optional<Review> findByMenuItemIdAndUserId(String menuItemId, String userId);
}
