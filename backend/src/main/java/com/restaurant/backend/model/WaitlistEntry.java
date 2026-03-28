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
@Document(collection = "waitlist")
public class WaitlistEntry {

    @Id
    private String id;
    
    private String restaurantId;
    private String customerName;
    private int guestCount;
    private int estimatedWaitTimeMinutes;
    
    private String status; // WAITING, SEATED, CANCELLED
    
    private LocalDateTime joinedAt = LocalDateTime.now();
}
