package com.restaurant.backend.dto;

import lombok.Data;

@Data
public class TableBookingRequest {
    private int guests;
    private String customerName;
    private String restaurantId;
}