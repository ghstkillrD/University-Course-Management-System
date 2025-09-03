package com.ucms.controller;

import com.ucms.dto.LoginRequest;
import com.ucms.dto.LoginResponse;
import com.ucms.dto.ErrorResponse;
import com.ucms.dto.StudentRegistrationRequest;
import com.ucms.dto.UserInfo;
import com.ucms.entity.User;
import com.ucms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", java.time.Instant.now());
        health.put("service", "UCMS Backend");
        return ResponseEntity.ok(health);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getUsername());
            System.out.println("Password provided: " + (loginRequest.getPassword() != null ? "****" : "null"));
            
            LoginResponse response = authService.authenticateUser(loginRequest);
            System.out.println("Login successful for user: " + loginRequest.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Login failed for user: " + loginRequest.getUsername() + ", error: " + e.getMessage());
            e.printStackTrace();
            
            String errorMessage = "Invalid username or password";
            if (e.getMessage().contains("Bad credentials")) {
                errorMessage = "Invalid username or password";
            } else if (e.getMessage().contains("User not found")) {
                errorMessage = "User not found";
            } else if (e.getMessage().contains("Account is disabled")) {
                errorMessage = "Account is disabled";
            }
            
            ErrorResponse errorResponse = new ErrorResponse(errorMessage, 401);
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserInfo> registerStudent(@Valid @RequestBody StudentRegistrationRequest signUpRequest) {
        UserInfo userInfo = authService.registerStudent(signUpRequest);
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfo> getCurrentUser() {
        UserInfo userInfo = authService.getCurrentUserInfo();
        return ResponseEntity.ok(userInfo);
    }
}