package com.restaurant.backend.controller;

import com.restaurant.backend.model.Restaurant;
import com.restaurant.backend.model.Role;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.RestaurantRepository;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Restaurant> getRestaurants(
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String cuisine,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        if (activeOnly != null && activeOnly) {
            restaurants = restaurants.stream().filter(Restaurant::isActive).toList();
        }

        if (query != null && !query.isBlank()) {
            String normalized = query.trim().toLowerCase(Locale.ROOT);
            restaurants = restaurants.stream().filter(restaurant ->
                    containsIgnoreCase(restaurant.getName(), normalized)
                            || containsIgnoreCase(restaurant.getCuisine(), normalized)
                            || containsIgnoreCase(restaurant.getAddress(), normalized)
            ).toList();
        }

        if (cuisine != null && !cuisine.isBlank()) {
            String normalizedCuisine = cuisine.trim().toLowerCase(Locale.ROOT);
            restaurants = restaurants.stream().filter(restaurant ->
                    containsIgnoreCase(restaurant.getCuisine(), normalizedCuisine)
            ).toList();
        }

        Comparator<Restaurant> comparator;
        switch (sortBy.toLowerCase(Locale.ROOT)) {
            case "cuisine" -> comparator = Comparator.comparing(r -> safeLower(r.getCuisine()));
            case "newest" -> comparator = Comparator.comparing(Restaurant::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
            default -> comparator = Comparator.comparing(r -> safeLower(r.getName()));
        }

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }

        return restaurants.stream().sorted(comparator).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(id);
        if (restaurantOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(restaurantOpt.get());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMyRestaurant(Authentication authentication) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        User user = userOpt.get();
        if (user.getRole() != Role.ADMIN || user.getRestaurantId() == null) {
            return ResponseEntity.status(403).body("Only restaurant admins can access this endpoint.");
        }

        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(user.getRestaurantId());
        if (restaurantOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Restaurant not found for admin.");
        }

        return ResponseEntity.ok(restaurantOpt.get());
    }

    private boolean containsIgnoreCase(String value, String search) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(search);
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}
