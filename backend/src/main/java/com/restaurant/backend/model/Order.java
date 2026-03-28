package com.restaurant.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    
    private String restaurantId;
    private String userId; // Reference to who made the order
    private String tableId; // Reference to the table (null if online order)
    
    private List<OrderItem> items;
    private double totalAmount;
    
    private String status; // PENDING, PREPARING, COMPLETED
    private String orderType; // DINE_IN, ONLINE

    private String paymentMethod; // CARD, UPI
    private String paymentStatus; // PENDING, PAID, FAILED
    private String paymentReference;
    private String deliveryAddress;
    private String deliveryStatus; // ORDER_PLACED, ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED
    private Integer estimatedDeliveryMinutes;
    private List<OrderTrackingEvent> trackingEvents = new ArrayList<>();
    private String cardHolderName;
    private String cardNetwork; // VISA, MASTERCARD
    private String expiryDate;
    private String cardLast4;
    private String upiId;
    private LocalDateTime paidAt;
    private LocalDateTime completedAt;

    @Transient
    private String cardNumber;

    @Transient
    private String cvv;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
