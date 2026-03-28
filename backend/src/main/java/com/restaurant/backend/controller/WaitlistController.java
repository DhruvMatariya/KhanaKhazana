package com.restaurant.backend.controller;

import com.restaurant.backend.dto.WaitlistJoinRequest;
import com.restaurant.backend.model.WaitlistEntry;
import com.restaurant.backend.repository.WaitlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {

    @Autowired
    private WaitlistRepository waitlistRepository;

    @GetMapping
    public ResponseEntity<?> getWaitlist(@RequestParam String restaurantId) {
        if (restaurantId == null || restaurantId.isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required.");
        }

        return ResponseEntity.ok(waitlistRepository.findByRestaurantIdAndStatusOrderByJoinedAtAsc(restaurantId, "WAITING"));
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinWaitlist(
            @RequestBody(required = false) WaitlistJoinRequest request,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) String restaurantId
    ) {
        String customerName = name;
        Integer guestCount = guests;
        String resolvedRestaurantId = restaurantId;

        if (request != null) {
            if (request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
                customerName = request.getCustomerName().trim();
            }
            if (request.getGuests() != null) {
                guestCount = request.getGuests();
            }
            if (request.getRestaurantId() != null && !request.getRestaurantId().isBlank()) {
                resolvedRestaurantId = request.getRestaurantId().trim();
            }
        }

        if (customerName == null || customerName.isBlank()) {
            return ResponseEntity.badRequest().body("Customer name is required.");
        }
        if (guestCount == null || guestCount < 1) {
            return ResponseEntity.badRequest().body("Guests must be at least 1.");
        }
        if (resolvedRestaurantId == null || resolvedRestaurantId.isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required.");
        }

        int currentWaitlistSize = waitlistRepository.findByRestaurantIdAndStatus(resolvedRestaurantId, "WAITING").size();
        int estimatedWaitTime = (currentWaitlistSize + 1) * 15;

        WaitlistEntry entry = new WaitlistEntry();
        entry.setRestaurantId(resolvedRestaurantId);
        entry.setCustomerName(customerName);
        entry.setGuestCount(guestCount);
        entry.setEstimatedWaitTimeMinutes(estimatedWaitTime);
        entry.setStatus("WAITING");
        entry.setJoinedAt(LocalDateTime.now());

        waitlistRepository.save(entry);
        return ResponseEntity.ok(entry);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelWaitlist(@PathVariable String id) {
        Optional<WaitlistEntry> entryOpt = waitlistRepository.findById(id);
        if (entryOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        WaitlistEntry entry = entryOpt.get();
        entry.setStatus("CANCELLED");
        waitlistRepository.save(entry);
        return ResponseEntity.ok(entry);
    }
}
