package com.restaurant.backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String email; // Only used for registration
    private String role;
    private String restaurantName;
    private String cuisine;
    private String address;
    private String logoImageUrl;
    private String coverImageUrl;
}
