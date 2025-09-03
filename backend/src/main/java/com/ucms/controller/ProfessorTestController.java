package com.ucms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test-professor")
public class ProfessorTestController {

    @GetMapping("/simple")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("Professor Test Controller Works!");
    }
}
