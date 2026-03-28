package com.restaurant.backend.dto;

import lombok.Data;

@Data
public class AssistantChatRequest {
    private String message;
    private String restaurantId;
}
