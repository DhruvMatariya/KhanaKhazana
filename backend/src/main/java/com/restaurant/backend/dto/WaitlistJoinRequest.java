package com.restaurant.backend.dto;

import lombok.Data;

@Data
public class WaitlistJoinRequest {
    private String customerName;
    private Integer guests;
    private String restaurantId;
}