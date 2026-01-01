package com.coffeeshop.controller;

import com.coffeeshop.dto.ApiResponse;
import com.coffeeshop.dto.JwtResponse;
import com.coffeeshop.dto.LoginRequest;
import com.coffeeshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
@SuppressWarnings("null")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", jwtResponse));
        } catch (BadCredentialsException e) {
            // Generic message to prevent user enumeration
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Invalid credentials"));
        } catch (Exception e) {
            // Log the actual error but return generic message to user
            logger.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(401)
                    .body(new ApiResponse(false, "Authentication failed"));
        }
    }
}
