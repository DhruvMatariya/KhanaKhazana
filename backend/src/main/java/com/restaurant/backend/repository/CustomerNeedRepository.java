package com.restaurant.backend.repository;

import com.restaurant.backend.model.CustomerNeed;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CustomerNeedRepository extends MongoRepository<CustomerNeed, String> {
    List<CustomerNeed> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);
}
