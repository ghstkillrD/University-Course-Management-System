package com.ucms.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {

    @PostMapping("/login")
    public String testLogin(@RequestBody String body) {
        System.out.println("Test login called with body: " + body);
        return "{\"message\": \"Test login successful\"}";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\": \"OK\"}";
    }
}
