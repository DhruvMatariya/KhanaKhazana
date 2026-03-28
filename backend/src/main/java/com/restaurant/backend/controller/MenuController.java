package com.restaurant.backend.controller;

import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.MenuItemRepository;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getMenuItems(@RequestParam String restaurantId, @RequestParam(defaultValue = "true") boolean onlyAvailable) {
        if (restaurantId == null || restaurantId.isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required");
        }

        if (onlyAvailable) {
            return ResponseEntity.ok(menuItemRepository.findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(restaurantId));
        }

        return ResponseEntity.ok(menuItemRepository.findByRestaurantIdOrderByCategoryAscNameAsc(restaurantId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createMenuItem(Authentication authentication, @RequestBody MenuItem menuItem) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized.");
        }

        User admin = userOpt.get();
        if (admin.getRestaurantId() == null) {
            return ResponseEntity.status(400).body("Admin is not linked to a restaurant.");
        }

        menuItem.setId(null);
        menuItem.setRestaurantId(admin.getRestaurantId());
        menuItem.setAverageRating(0.0);
        menuItem.setReviewCount(0);

        return ResponseEntity.ok(menuItemRepository.save(menuItem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMenuItem(@PathVariable String id, Authentication authentication, @RequestBody MenuItem payload) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized.");
        }

        Optional<MenuItem> menuItemOpt = menuItemRepository.findById(id);
        if (menuItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User admin = userOpt.get();
        MenuItem existing = menuItemOpt.get();
        if (!existing.getRestaurantId().equals(admin.getRestaurantId())) {
            return ResponseEntity.status(403).body("You can only update your own restaurant items.");
        }

        existing.setName(payload.getName());
        existing.setDescription(payload.getDescription());
        existing.setCategory(payload.getCategory());
        existing.setPrice(payload.getPrice());
        existing.setImageUrl(payload.getImageUrl());
        existing.setAvailable(payload.isAvailable());

        return ResponseEntity.ok(menuItemRepository.save(existing));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAvailability(@PathVariable String id, Authentication authentication, @RequestBody Map<String, Boolean> payload) {
        Boolean available = payload.get("available");
        if (available == null) {
            return ResponseEntity.badRequest().body("available is required.");
        }

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized.");
        }

        Optional<MenuItem> menuItemOpt = menuItemRepository.findById(id);
        if (menuItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MenuItem menuItem = menuItemOpt.get();
        if (!menuItem.getRestaurantId().equals(userOpt.get().getRestaurantId())) {
            return ResponseEntity.status(403).body("You can only update your own restaurant items.");
        }

        menuItem.setAvailable(available);
        return ResponseEntity.ok(menuItemRepository.save(menuItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable String id, Authentication authentication) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized.");
        }

        Optional<MenuItem> menuItemOpt = menuItemRepository.findById(id);
        if (menuItemOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MenuItem menuItem = menuItemOpt.get();
        if (!menuItem.getRestaurantId().equals(userOpt.get().getRestaurantId())) {
            return ResponseEntity.status(403).body("You can only delete your own restaurant items.");
        }

        menuItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
