package com.ucms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ucms.dto.EnrollmentRequest;
import com.ucms.dto.StudentScheduleResponse;
import com.ucms.entity.Course;
import com.ucms.entity.User;
import com.ucms.repository.UserRepository;
import com.ucms.service.CourseService;
import com.ucms.service.EnrollmentService;
import com.ucms.service.ProfessorService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/professor")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private CourseService courseService;

    // @Autowired
    // private EnrollmentService enrollmentService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Professor test endpoint working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    // @PreAuthorize("hasRole('PROFESSOR')")  // Temporarily disabled
    public ResponseEntity<Map<String, Object>> getProfessorStats(Authentication authentication) {
        String username = authentication.getName();
        User professor = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> stats = professorService.getProfessorStats(professor.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-courses")
    // @PreAuthorize("hasRole('PROFESSOR')")  // Temporarily disabled
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        String username = authentication.getName();
        User professor = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Course> courses = professorService.getProfessorCourses(professor.getId());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/course/{courseId}/roster")
    public ResponseEntity<Map<String, Object>> getCourseRoster(
            @PathVariable Long courseId,
            Authentication authentication) {
        String username = authentication.getName();
        User professor = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify professor teaches this course
        if (!professorService.isProfessorOfCourse(professor.getId(), courseId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> roster = professorService.getCourseRoster(courseId);
        return ResponseEntity.ok(roster);
    }

    @PutMapping("/course/{courseId}")
    public ResponseEntity<Course> updateCourseDetails(
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> updates,
            Authentication authentication) {
        String username = authentication.getName();
        User professor = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify professor teaches this course
        if (!professorService.isProfessorOfCourse(professor.getId(), courseId)) {
            return ResponseEntity.status(403).build();
        }
        
        Course updatedCourse = professorService.updateCourseDetails(courseId, updates);
        return ResponseEntity.ok(updatedCourse);
    }
}
