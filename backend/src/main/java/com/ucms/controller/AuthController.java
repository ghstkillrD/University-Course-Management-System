package com.ucms.controller;

import com.ucms.dto.LoginRequest;
import com.ucms.dto.LoginResponse;
import com.ucms.dto.StudentRegistrationRequest;
import com.ucms.dto.UserInfo;
import com.ucms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
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