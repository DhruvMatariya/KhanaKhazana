package com.restaurant.backend.repository;

import com.restaurant.backend.model.WaitlistEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WaitlistRepository extends MongoRepository<WaitlistEntry, String> {
    List<WaitlistEntry> findByStatus(String status);
    List<WaitlistEntry> findByStatusOrderByJoinedAtAsc(String status);
    List<WaitlistEntry> findByRestaurantIdAndStatus(String restaurantId, String status);
    List<WaitlistEntry> findByRestaurantIdAndStatusOrderByJoinedAtAsc(String restaurantId, String status);
}
