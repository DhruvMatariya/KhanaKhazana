package com.restaurant.backend.controller;

import com.restaurant.backend.model.Order;
import com.restaurant.backend.model.OrderTrackingEvent;
import com.restaurant.backend.model.Role;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.OrderRepository;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> placeOrder(Authentication authentication, @RequestBody Order order) {
        Optional<User> currentUserOpt = getCurrentUser(authentication);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User currentUser = currentUserOpt.get();
        if (order.getRestaurantId() == null || order.getRestaurantId().isBlank()) {
            return ResponseEntity.badRequest().body("restaurantId is required.");
        }

        if ("ONLINE".equalsIgnoreCase(order.getOrderType()) && (order.getDeliveryAddress() == null || order.getDeliveryAddress().isBlank())) {
            return ResponseEntity.badRequest().body("deliveryAddress is required for ONLINE orders.");
        }

        String validationError = validatePayment(order);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        LocalDateTime now = LocalDateTime.now();
        order.setUserId(currentUser.getId());
        order.setPaymentStatus("PAID");
        order.setPaidAt(now);
        order.setPaymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        if ("CARD".equalsIgnoreCase(order.getPaymentMethod()) && order.getCardLast4() != null) {
            String last4 = order.getCardLast4();
            order.setCardLast4(last4.substring(last4.length() - 4));
            order.setUpiId(null);
        }

        if ("UPI".equalsIgnoreCase(order.getPaymentMethod())) {
            order.setCardLast4(null);
        }

        if (order.getOrderType() == null || order.getOrderType().isBlank()) {
            order.setOrderType("ONLINE");
        }

        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("ORDER_PLACED");
        }

        if (order.getCreatedAt() == null) {
            order.setCreatedAt(now);
        }

        order.setUpdatedAt(now);
        order.setDeliveryStatus(resolveDeliveryStatus(order.getStatus()));
        if (order.getEstimatedDeliveryMinutes() == null && "ONLINE".equalsIgnoreCase(order.getOrderType())) {
            order.setEstimatedDeliveryMinutes(35);
        }
        appendTrackingEvent(order, order.getStatus(), "Order placed and payment confirmed");

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyOrders(Authentication authentication, @RequestParam(required = false) String restaurantId) {
        Optional<User> currentUserOpt = getCurrentUser(authentication);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User currentUser = currentUserOpt.get();
        if (currentUser.getRole() == Role.ADMIN) {
            if (currentUser.getRestaurantId() == null) {
                return ResponseEntity.badRequest().body("Admin is not linked to a restaurant.");
            }
            return ResponseEntity.ok(orderRepository.findByRestaurantIdOrderByCreatedAtDesc(currentUser.getRestaurantId()));
        }

        if (restaurantId == null || restaurantId.isBlank()) {
            return ResponseEntity.ok(orderRepository.findByUserId(currentUser.getId()));
        }

        return ResponseEntity.ok(orderRepository.findByUserIdAndRestaurantIdOrderByCreatedAtDesc(currentUser.getId(), restaurantId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders(Authentication authentication) {
        Optional<User> adminOpt = getCurrentUser(authentication);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User admin = adminOpt.get();
        if (admin.getRestaurantId() == null || admin.getRestaurantId().isBlank()) {
            return ResponseEntity.badRequest().body("Admin is not linked to a restaurant.");
        }

        return ResponseEntity.ok(orderRepository.findByRestaurantIdOrderByCreatedAtDesc(admin.getRestaurantId()));
    }

    @GetMapping("/today-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTodaySummary(Authentication authentication) {
        Optional<User> adminOpt = getCurrentUser(authentication);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User admin = adminOpt.get();
        if (admin.getRestaurantId() == null || admin.getRestaurantId().isBlank()) {
            return ResponseEntity.badRequest().body("Admin is not linked to a restaurant.");
        }

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        List<Order> todaysOrders = orderRepository.findByRestaurantIdAndCreatedAtBetween(admin.getRestaurantId(), start, end);

        BigDecimal onlineTotal = todaysOrders.stream()
                .filter(order -> "ONLINE".equalsIgnoreCase(order.getOrderType()))
                .map(order -> BigDecimal.valueOf(order.getTotalAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal dineInTotal = todaysOrders.stream()
                .filter(order -> "DINE_IN".equalsIgnoreCase(order.getOrderType()))
                .map(order -> BigDecimal.valueOf(order.getTotalAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("date", today.toString());
        response.put("onlineAmount", onlineTotal.doubleValue());
        response.put("dineInAmount", dineInTotal.doubleValue());
        response.put("combinedAmount", onlineTotal.add(dineInTotal).doubleValue());
        response.put("ordersCount", todaysOrders.size());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, Authentication authentication, @RequestBody Map<String, String> payload) {
        Optional<User> adminOpt = getCurrentUser(authentication);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body("status is required.");
        }

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User admin = adminOpt.get();
        Order order = orderOpt.get();
        if (!Objects.equals(order.getRestaurantId(), admin.getRestaurantId())) {
            return ResponseEntity.status(403).body("Cannot update order for another restaurant.");
        }

        String normalizedStatus = status.toUpperCase(Locale.ROOT);
        order.setStatus(normalizedStatus);
        order.setDeliveryStatus(resolveDeliveryStatus(normalizedStatus));
        order.setUpdatedAt(LocalDateTime.now());

        if ("COMPLETED".equalsIgnoreCase(normalizedStatus) || "DELIVERED".equalsIgnoreCase(normalizedStatus)) {
            order.setCompletedAt(LocalDateTime.now());
        }

        appendTrackingEvent(order, normalizedStatus, "Status updated by restaurant admin");
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/{id}/tracking")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrderTracking(@PathVariable String id, Authentication authentication) {
        Optional<User> currentUserOpt = getCurrentUser(authentication);
        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User currentUser = currentUserOpt.get();
        Order order = orderOpt.get();

        boolean isOwnerCustomer = currentUser.getRole() == Role.CUSTOMER && Objects.equals(order.getUserId(), currentUser.getId());
        boolean isRestaurantAdmin = currentUser.getRole() == Role.ADMIN && Objects.equals(order.getRestaurantId(), currentUser.getRestaurantId());

        if (!isOwnerCustomer && !isRestaurantAdmin) {
            return ResponseEntity.status(403).body("Not allowed to view this order tracking.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getId());
        response.put("status", order.getStatus());
        response.put("deliveryStatus", order.getDeliveryStatus());
        response.put("updatedAt", order.getUpdatedAt());
        response.put("estimatedDeliveryMinutes", order.getEstimatedDeliveryMinutes());
        response.put("trackingEvents", order.getTrackingEvents());

        return ResponseEntity.ok(response);
    }

    private void appendTrackingEvent(Order order, String status, String note) {
        if (order.getTrackingEvents() == null) {
            order.setTrackingEvents(new java.util.ArrayList<>());
        }
        order.getTrackingEvents().add(new OrderTrackingEvent(status, note, LocalDateTime.now()));
    }

    private String resolveDeliveryStatus(String status) {
        if (status == null || status.isBlank()) {
            return "ORDER_PLACED";
        }

        String normalized = status.toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "ORDER_PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED" -> normalized;
            case "COMPLETED" -> "DELIVERED";
            default -> normalized;
        };
    }

    private String validatePayment(Order order) {
        if (order.getPaymentMethod() == null || order.getPaymentMethod().isBlank()) {
            return "Payment method is required.";
        }

        String method = order.getPaymentMethod().toUpperCase(Locale.ROOT);
        if (!"CARD".equals(method) && !"UPI".equals(method)) {
            return "Unsupported payment method. Use CARD or UPI.";
        }

        if ("CARD".equals(method)) {
            String cardHolderName = order.getCardHolderName();
            if (cardHolderName == null || cardHolderName.isBlank()) {
                return "Cardholder name is required for CARD payments.";
            }

            String cardNumber = order.getCardNumber();
            if (cardNumber == null || cardNumber.isBlank()) {
                return "Card number is required for CARD payments.";
            }

            String digitsOnly = cardNumber.replaceAll("\\D", "");
            if (digitsOnly.length() != 16) {
                return "Card number must contain 16 digits.";
            }

            String expiryDate = order.getExpiryDate() == null ? null : order.getExpiryDate().trim();
            if (expiryDate == null || !expiryDate.matches("^(0[1-9]|1[0-2])/[0-9]{2}$")) {
                return "Expiry date must be in MM/YY format.";
            }

            order.setExpiryDate(expiryDate);

            String cvv = order.getCvv();
            if (cvv == null || !cvv.matches("^[0-9]{3,4}$")) {
                return "CVV must be 3 or 4 digits.";
            }

            String inferredNetwork = inferNetwork(digitsOnly);
            String selectedNetwork = order.getCardNetwork() == null ? "" : order.getCardNetwork().trim().toUpperCase(Locale.ROOT);
            if (!"VISA".equals(selectedNetwork) && !"MASTERCARD".equals(selectedNetwork)) {
                return "Card network must be VISA or MASTERCARD.";
            }

            if (inferredNetwork != null && !inferredNetwork.equals(selectedNetwork)) {
                return "Card number does not match selected card network.";
            }

            order.setCardLast4(digitsOnly.substring(digitsOnly.length() - 4));
            order.setCardNumber(null);
            order.setCvv(null);
            order.setCardNetwork(selectedNetwork);
            order.setCardHolderName(cardHolderName.trim());
        }

        if ("UPI".equals(method)) {
            String upiId = order.getUpiId();
            if (upiId == null || !upiId.contains("@")) {
                return "Valid UPI ID is required for UPI payments.";
            }
            order.setUpiId(upiId.trim());
            order.setCardHolderName(null);
            order.setCardNetwork(null);
            order.setExpiryDate(null);
            order.setCardLast4(null);
            order.setCardNumber(null);
            order.setCvv(null);
        }

        return null;
    }

    private String inferNetwork(String digitsOnly) {
        if (digitsOnly.startsWith("4")) {
            return "VISA";
        }

        if (digitsOnly.length() >= 2) {
            int firstTwo = Integer.parseInt(digitsOnly.substring(0, 2));
            if (firstTwo >= 51 && firstTwo <= 55) {
                return "MASTERCARD";
            }
        }

        if (digitsOnly.length() >= 4) {
            int firstFour = Integer.parseInt(digitsOnly.substring(0, 4));
            if (firstFour >= 2221 && firstFour <= 2720) {
                return "MASTERCARD";
            }
        }

        return null;
    }

    private Optional<User> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return Optional.empty();
        }
        return userRepository.findByUsername(authentication.getName());
    }
}
