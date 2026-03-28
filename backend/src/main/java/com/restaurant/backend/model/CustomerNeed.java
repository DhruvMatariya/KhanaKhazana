package com.restaurant.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "customer_needs")
public class CustomerNeed {

    @Id
    private String id;

    private String restaurantId;
    private String orderId;
    private String shortOrderId;
    private String userId;
    private String username;
    private String dishName;
    private String message;
    private String type; // COMPLAINT or SUGGESTION
    private String status; // OPEN, IN_PROGRESS, RESOLVED
    private LocalDateTime createdAt = LocalDateTime.now();
}
