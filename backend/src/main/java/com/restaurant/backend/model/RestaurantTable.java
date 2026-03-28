package com.restaurant.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tables")
public class RestaurantTable {
    
    @Id
    private String id;
    
    private String restaurantId;
    private int tableNumber;
    private int capacity;
    private boolean isOccupied;
}
