package com.restaurant.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "menu_items")
public class MenuItem {

    @Id
    private String id;

    private String restaurantId;
    private String name;
    private String description;
    private String category;
    private double price;
    private String imageUrl;
    private boolean available = true;
    private double averageRating = 0.0;
    private int reviewCount = 0;
}
