package com.restaurant.backend.repository;

import com.restaurant.backend.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    Optional<Restaurant> findByAdminUserId(String adminUserId);
}
