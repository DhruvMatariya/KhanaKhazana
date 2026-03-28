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
@Document(collection = "restaurants")
public class Restaurant {

    @Id
    private String id;

    private String name;
    private String cuisine;
    private String address;
    private String logoImageUrl;
    private String coverImageUrl;
    private String adminUserId;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
