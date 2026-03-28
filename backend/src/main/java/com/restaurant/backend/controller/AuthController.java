package com.restaurant.backend.controller;

import com.restaurant.backend.dto.AuthRequest;
import com.restaurant.backend.dto.AuthResponse;
import com.restaurant.backend.model.Restaurant;
import com.restaurant.backend.model.Role;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.RestaurantRepository;
import com.restaurant.backend.repository.UserRepository;
import com.restaurant.backend.security.CustomUserDetailsService;
import com.restaurant.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setEmail(request.getEmail());
        newUser.setRole(Role.CUSTOMER);

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(toAuthResponse(savedUser));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerRestaurantAdmin(@RequestBody AuthRequest request) {
        if (request.getRestaurantName() == null || request.getRestaurantName().isBlank()) {
            return ResponseEntity.badRequest().body("Restaurant name is required for admin registration.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters.");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        User admin = new User();
        admin.setUsername(request.getUsername().trim());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setEmail(request.getEmail().trim());
        admin.setRole(Role.ADMIN);
        admin = userRepository.save(admin);

        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getRestaurantName().trim());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setAddress(request.getAddress());
        restaurant.setLogoImageUrl(request.getLogoImageUrl());
        restaurant.setCoverImageUrl(request.getCoverImageUrl());
        restaurant.setAdminUserId(admin.getId());
        restaurant = restaurantRepository.save(restaurant);

        admin.setRestaurantId(restaurant.getId());
        admin = userRepository.save(admin);

        return ResponseEntity.ok(toAuthResponse(admin));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(toAuthResponse(user));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getUsername()));
        return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getRestaurantId(), token);
    }
}
