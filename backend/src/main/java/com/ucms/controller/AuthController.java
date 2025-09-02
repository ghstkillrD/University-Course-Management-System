package com.ucms.controller;

import com.ucms.dto.LoginRequest;
import com.ucms.dto.LoginResponse;
import com.ucms.dto.StudentRegistrationRequest;
import com.ucms.dto.UserInfo;
import com.ucms.entity.User;
import com.ucms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getUsername());
            System.out.println("Password provided: " + (loginRequest.getPassword() != null ? "****" : "null"));
            
            // Temporarily bypass authentication and return a mock response
            UserInfo mockUserInfo = new UserInfo();
            mockUserInfo.setId(1L);
            mockUserInfo.setUsername(loginRequest.getUsername());
            mockUserInfo.setRole(User.Role.ADMIN);
            mockUserInfo.setName("Admin User");
            mockUserInfo.setEmail("admin@example.com");
            
            LoginResponse response = new LoginResponse("mock-jwt-token", mockUserInfo);
            System.out.println("Mock login successful for user: " + loginRequest.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Login failed for user: " + loginRequest.getUsername() + ", error: " + e.getMessage());
            e.printStackTrace();
            throw e;
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