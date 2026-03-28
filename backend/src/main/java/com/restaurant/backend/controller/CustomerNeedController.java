package com.restaurant.backend.controller;

import com.restaurant.backend.model.CustomerNeed;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.CustomerNeedRepository;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer-needs")
public class CustomerNeedController {

    private final CustomerNeedRepository customerNeedRepository;
    private final UserRepository userRepository;

    public CustomerNeedController(CustomerNeedRepository customerNeedRepository, UserRepository userRepository) {
        this.customerNeedRepository = customerNeedRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/my-restaurant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMyRestaurantNeeds(Authentication authentication) {
        Optional<User> adminOpt = userRepository.findByUsername(authentication.getName());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User admin = adminOpt.get();
        if (admin.getRestaurantId() == null || admin.getRestaurantId().isBlank()) {
            return ResponseEntity.badRequest().body("Admin is not linked to a restaurant.");
        }

        return ResponseEntity.ok(customerNeedRepository.findByRestaurantIdOrderByCreatedAtDesc(admin.getRestaurantId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, Authentication authentication, @RequestBody Map<String, String> payload) {
        Optional<User> adminOpt = userRepository.findByUsername(authentication.getName());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body("status is required.");
        }

        Optional<CustomerNeed> needOpt = customerNeedRepository.findById(id);
        if (needOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CustomerNeed need = needOpt.get();
        User admin = adminOpt.get();
        if (!Objects.equals(need.getRestaurantId(), admin.getRestaurantId())) {
            return ResponseEntity.status(403).body("Cannot modify entries for another restaurant.");
        }

        String normalized = status.trim().toUpperCase();
        if (!normalized.equals("OPEN") && !normalized.equals("IN_PROGRESS") && !normalized.equals("RESOLVED")) {
            return ResponseEntity.badRequest().body("status must be OPEN, IN_PROGRESS, or RESOLVED.");
        }

        need.setStatus(normalized);
        return ResponseEntity.ok(customerNeedRepository.save(need));
    }
}
