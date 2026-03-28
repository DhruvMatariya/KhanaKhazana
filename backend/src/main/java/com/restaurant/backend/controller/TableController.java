package com.restaurant.backend.controller;

import com.restaurant.backend.dto.TableBookingRequest;
import com.restaurant.backend.model.Order;
import com.restaurant.backend.model.RestaurantTable;
import com.restaurant.backend.model.User;
import com.restaurant.backend.model.WaitlistEntry;
import com.restaurant.backend.repository.OrderRepository;
import com.restaurant.backend.repository.TableRepository;
import com.restaurant.backend.repository.UserRepository;
import com.restaurant.backend.repository.WaitlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private WaitlistRepository waitlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<?> getAllTables(@RequestParam String restaurantId) {
        if (restaurantId == null || restaurantId.isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required.");
        }

        return ResponseEntity.ok(tableRepository.findByRestaurantIdOrderByTableNumberAsc(restaurantId));
    }

    @PostMapping("/book")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> bookTable(@RequestBody TableBookingRequest request) {
        if (request.getRestaurantId() == null || request.getRestaurantId().isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required.");
        }

        int guests = request.getGuests();
        if (guests < 1) {
            return ResponseEntity.badRequest().body("Guests must be at least 1.");
        }
        if (guests > 12) {
            return ResponseEntity.badRequest().body("Party too large. Maximum capacity is 12.");
        }

        Optional<RestaurantTable> bestFit = tableRepository.findByRestaurantIdAndIsOccupiedFalse(request.getRestaurantId()).stream()
                .filter(t -> t.getCapacity() >= guests)
                .min(Comparator.comparingInt(RestaurantTable::getCapacity));

        if (bestFit.isPresent()) {
            RestaurantTable table = bestFit.get();
            table.setOccupied(true);
            RestaurantTable savedTable = tableRepository.save(table);

            Map<String, Object> response = new HashMap<>();
            response.put("allocated", true);
            response.put("table", savedTable);
            response.put("message", "Table " + savedTable.getTableNumber() + " allocated successfully.");
            return ResponseEntity.ok(response);
        }

        int currentWaitlistSize = waitlistRepository.findByRestaurantIdAndStatus(request.getRestaurantId(), "WAITING").size();
        int estimatedWaitTime = (currentWaitlistSize + 1) * 15;

        Map<String, Object> response = new HashMap<>();
        response.put("allocated", false);
        response.put("estimatedWaitMinutes", estimatedWaitTime);
        response.put("message", "No tables available. Join the queue.");
        return ResponseEntity.status(409).body(response);
    }

    @PostMapping("/allocate")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> allocateTable(@RequestParam int guests, @RequestParam String restaurantId) {
        TableBookingRequest request = new TableBookingRequest();
        request.setGuests(guests);
        request.setRestaurantId(restaurantId);
        return bookTable(request);
    }

    @PostMapping("/free/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> freeTable(@PathVariable String id, Authentication authentication, @RequestBody Map<String, Object> payload) {
        Optional<User> adminOpt = userRepository.findByUsername(authentication.getName());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User admin = adminOpt.get();

        if (payload == null || !payload.containsKey("totalAmount")) {
            return ResponseEntity.badRequest().body("totalAmount is required.");
        }

        double totalAmount;
        try {
            totalAmount = Double.parseDouble(String.valueOf(payload.get("totalAmount")));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("totalAmount must be a valid number.");
        }

        if (totalAmount <= 0) {
            return ResponseEntity.badRequest().body("totalAmount must be greater than 0.");
        }

        Optional<RestaurantTable> tableOpt = tableRepository.findById(id);
        if (tableOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        RestaurantTable table = tableOpt.get();
        if (!Objects.equals(table.getRestaurantId(), admin.getRestaurantId())) {
            return ResponseEntity.status(403).body("Cannot release table from another restaurant.");
        }

        LocalDateTime now = LocalDateTime.now();
        Order dineInOrder = new Order();
        dineInOrder.setRestaurantId(table.getRestaurantId());
        dineInOrder.setUserId(admin.getId());
        dineInOrder.setTableId(table.getId());
        dineInOrder.setItems(List.of());
        dineInOrder.setTotalAmount(totalAmount);
        dineInOrder.setStatus("COMPLETED");
        dineInOrder.setOrderType("DINE_IN");
        dineInOrder.setPaymentMethod("CARD");
        dineInOrder.setPaymentStatus("PAID");
        dineInOrder.setPaymentReference("DINEIN-" + table.getTableNumber() + "-" + now.toLocalTime().withNano(0));
        dineInOrder.setDeliveryStatus("DELIVERED");
        dineInOrder.setPaidAt(now);
        dineInOrder.setCompletedAt(now);
        dineInOrder.setCreatedAt(now);
        dineInOrder.setUpdatedAt(now);
        orderRepository.save(dineInOrder);

        table.setOccupied(false);
        RestaurantTable freedTable = tableRepository.save(table);

        Map<String, Object> response = new HashMap<>();
        response.put("table", freedTable);
        response.put("message", "Table released successfully. Dine-in bill recorded.");
        response.put("recordedBillAmount", totalAmount);

        List<WaitlistEntry> waitingEntries = waitlistRepository.findByRestaurantIdAndStatusOrderByJoinedAtAsc(table.getRestaurantId(), "WAITING");
        Optional<WaitlistEntry> nextEntry = waitingEntries.stream()
                .filter(entry -> entry.getGuestCount() <= table.getCapacity())
                .findFirst();

        if (nextEntry.isPresent()) {
            WaitlistEntry entry = nextEntry.get();
            entry.setStatus("SEATED");
            waitlistRepository.save(entry);

            table.setOccupied(true);
            RestaurantTable reassignedTable = tableRepository.save(table);

            response.put("autoSeated", true);
            response.put("seatedEntry", entry);
            response.put("table", reassignedTable);
            response.put("message", "Table released and auto-assigned to queued customer " + entry.getCustomerName() + ".");
        } else {
            response.put("autoSeated", false);
        }

        return ResponseEntity.ok(response);
    }
}
