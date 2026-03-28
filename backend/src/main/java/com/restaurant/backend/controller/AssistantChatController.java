package com.restaurant.backend.controller;

import com.restaurant.backend.dto.AssistantChatRequest;
import com.restaurant.backend.dto.AssistantChatResponse;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.UserRepository;
import com.restaurant.backend.service.AssistantChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/assistant")
public class AssistantChatController {

    private final AssistantChatService assistantChatService;
    private final UserRepository userRepository;

    public AssistantChatController(AssistantChatService assistantChatService, UserRepository userRepository) {
        this.assistantChatService = assistantChatService;
        this.userRepository = userRepository;
    }

    @PostMapping("/chat")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> chat(Authentication authentication, @RequestBody AssistantChatRequest request) {
        if (request == null || request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body("message is required.");
        }

        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found.");
        }

        String reply = assistantChatService.generateCustomerReply(
                userOpt.get(),
                request.getMessage(),
                request.getRestaurantId()
        );

        return ResponseEntity.ok(new AssistantChatResponse(reply));
    }
}
