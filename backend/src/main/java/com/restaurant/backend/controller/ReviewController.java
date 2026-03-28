package com.restaurant.backend.controller;

import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.Review;
import com.restaurant.backend.model.Role;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.MenuItemRepository;
import com.restaurant.backend.repository.OrderRepository;
import com.restaurant.backend.repository.ReviewRepository;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/menu/{menuItemId}")
    public List<Review> getMenuItemReviews(@PathVariable String menuItemId) {
        return reviewRepository.findByMenuItemIdOrderByCreatedAtDesc(menuItemId);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyReviews(Authentication authentication, @RequestParam String restaurantId) {
        if (restaurantId == null || restaurantId.isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required.");
        }

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        User user = userOpt.get();
        return ResponseEntity.ok(reviewRepository.findByUserIdAndRestaurantId(user.getId(), restaurantId));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addOrUpdateReview(Authentication authentication, @RequestBody Map<String, String> payload) {
        String menuItemId = payload.get("menuItemId");
        String ratingValue = payload.get("rating");
        String comment = payload.getOrDefault("comment", "");

        if (menuItemId == null || menuItemId.isBlank()) {
            return ResponseEntity.badRequest().body("menuItemId is required.");
        }
        if (ratingValue == null || ratingValue.isBlank()) {
            return ResponseEntity.badRequest().body("rating is required.");
        }

        int rating;
        try {
            rating = Integer.parseInt(ratingValue);
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().body("rating must be a number from 1 to 5.");
        }

        if (rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body("rating must be in the range 1..5.");
        }

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        User user = userOpt.get();
        if (user.getRole() != Role.CUSTOMER) {
            return ResponseEntity.status(403).body("Only customers can submit reviews.");
        }

        Optional<MenuItem> menuItemOpt = menuItemRepository.findById(menuItemId);
        if (menuItemOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Menu item not found.");
        }

        MenuItem menuItem = menuItemOpt.get();
        boolean purchased = orderRepository
                .findByUserIdAndRestaurantId(user.getId(), menuItem.getRestaurantId())
                .stream()
            .filter(order -> isDeliveredOrCompleted(order.getDeliveryStatus(), order.getStatus()))
            .filter(order -> order.getItems() != null)
                .flatMap(order -> order.getItems().stream())
                .anyMatch(item -> menuItemId.equals(item.getMenuItemId()));

        if (!purchased) {
            return ResponseEntity.status(403).body("You can review only items you have purchased.");
        }

        Review review = reviewRepository.findByMenuItemIdAndUserId(menuItemId, user.getId())
                .orElseGet(Review::new);

        review.setMenuItemId(menuItemId);
        review.setRestaurantId(menuItem.getRestaurantId());
        review.setUserId(user.getId());
        review.setUsername(user.getUsername());
        review.setRating(rating);
        review.setComment(comment == null ? "" : comment.trim());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        refreshMenuRating(menuItem);

        return ResponseEntity.ok(savedReview);
    }

    private void refreshMenuRating(MenuItem menuItem) {
        List<Review> reviews = reviewRepository.findByMenuItemIdOrderByCreatedAtDesc(menuItem.getId());
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        menuItem.setAverageRating(Math.round(avg * 10.0) / 10.0);
        menuItem.setReviewCount(reviews.size());
        menuItemRepository.save(menuItem);
    }

    private boolean isDeliveredOrCompleted(String deliveryStatus, String orderStatus) {
        if (Objects.equals("DELIVERED", deliveryStatus)) {
            return true;
        }
        return Objects.equals("COMPLETED", orderStatus) || Objects.equals("DELIVERED", orderStatus);
    }
}
