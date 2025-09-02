package com.ucms.controller;

import com.ucms.dto.CreateUserRequest;
import com.ucms.dto.UserResponse;
import com.ucms.entity.Professor;
import com.ucms.entity.Student;
import com.ucms.entity.User;
import com.ucms.repository.ProfessorRepository;
import com.ucms.repository.StudentRepository;
import com.ucms.repository.UserRepository;
import com.ucms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
// @PreAuthorize("hasRole('ADMIN')") // Commented out for testing - enable later
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private AdminService adminService;

    // ===============================
    // USER MANAGEMENT ENDPOINTS
    // ===============================

    /**
     * Get all users with optional role filtering
     */
    @GetMapping("/users")
    public ResponseEntity<String> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role) {
        
        try {
            long userCount = userRepository.count();
            return ResponseEntity.ok("Users found: " + userCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Get user by ID
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(convertToUserResponse(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Create a new user (Student, Professor, or Admin)
     */
    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User createdUser = adminService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToUserResponse(createdUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update user details
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId, 
            @Valid @RequestBody CreateUserRequest request) {
        try {
            User updatedUser = adminService.updateUser(userId, request);
            return ResponseEntity.ok(convertToUserResponse(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Deactivate/Delete user
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ===============================
    // STUDENT MANAGEMENT ENDPOINTS
    // ===============================

    /**
     * Get all students
     */
    @GetMapping("/students")
    public ResponseEntity<Page<UserResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> students = userRepository.findByRole(User.Role.STUDENT, pageable);
        Page<UserResponse> studentResponses = students.map(this::convertToUserResponse);
        return ResponseEntity.ok(studentResponses);
    }

    // ===============================
    // PROFESSOR MANAGEMENT ENDPOINTS
    // ===============================

    /**
     * Get all professors
     */
    @GetMapping("/professors")
    public ResponseEntity<Page<UserResponse>> getAllProfessors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> professors = userRepository.findByRole(User.Role.PROFESSOR, pageable);
        Page<UserResponse> professorResponses = professors.map(this::convertToUserResponse);
        return ResponseEntity.ok(professorResponses);
    }

    // ===============================
    // STATISTICS ENDPOINTS
    // ===============================

    /**
     * Get system statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<SystemStats> getSystemStats() {
        long totalStudents = userRepository.countByRole(User.Role.STUDENT);
        long totalProfessors = userRepository.countByRole(User.Role.PROFESSOR);
        long totalAdmins = userRepository.countByRole(User.Role.ADMIN);
        long totalUsers = userRepository.count();

        SystemStats stats = new SystemStats(totalUsers, totalStudents, totalProfessors, totalAdmins);
        return ResponseEntity.ok(stats);
    }

    // ===============================
    // HELPER METHODS
    // ===============================

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().toString());
        response.setCreatedAt(user.getCreatedAt());
        response.setActive(user.isActive());

        // Get profile-specific details
        if (user.getRole() == User.Role.STUDENT) {
            Student student = studentRepository.findById(user.getId()).orElse(null);
            if (student != null) {
                response.setName(student.getName());
                response.setEmail(student.getEmail());
                response.setStudentId(student.getStudentId());
            }
        } else if (user.getRole() == User.Role.PROFESSOR) {
            Professor professor = professorRepository.findById(user.getId()).orElse(null);
            if (professor != null) {
                response.setName(professor.getName());
                response.setEmail(professor.getEmail());
                response.setEmployeeId(professor.getEmployeeId());
                response.setDepartment(professor.getDepartment());
            }
        }

        return response;
    }

    // Inner class for system statistics
    public static class SystemStats {
        private long totalUsers;
        private long totalStudents;
        private long totalProfessors;
        private long totalAdmins;

        public SystemStats(long totalUsers, long totalStudents, long totalProfessors, long totalAdmins) {
            this.totalUsers = totalUsers;
            this.totalStudents = totalStudents;
            this.totalProfessors = totalProfessors;
            this.totalAdmins = totalAdmins;
        }

        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getTotalStudents() { return totalStudents; }
        public long getTotalProfessors() { return totalProfessors; }
        public long getTotalAdmins() { return totalAdmins; }
    }
}
