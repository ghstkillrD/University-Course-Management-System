package com.ucms.controller;

import com.ucms.dto.*;
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

import java.util.List;

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
     * Get all users with optional role filtering and search
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users;
            
            if (search != null && !search.trim().isEmpty()) {
                // Search by name, username, or ID
                if (role != null && !role.isEmpty()) {
                    User.Role userRole = User.Role.valueOf(role.toUpperCase());
                    users = userRepository.findByRoleAndSearch(userRole, search.trim(), pageable);
                } else {
                    users = userRepository.findBySearch(search.trim(), pageable);
                }
            } else if (role != null && !role.isEmpty()) {
                User.Role userRole = User.Role.valueOf(role.toUpperCase());
                users = userRepository.findByRole(userRole, pageable);
            } else {
                users = userRepository.findAll(pageable);
            }
            
            Page<UserResponse> userResponses = users.map(this::convertToUserResponse);
            return ResponseEntity.ok(userResponses);
        } catch (Exception e) {
            e.printStackTrace(); // Add stack trace to logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage() + " - " + e.getClass().getSimpleName());
        }
    }

    /**
     * Debug endpoint to test conversion
     */
    @GetMapping("/users/debug")
    public ResponseEntity<?> debugUsers() {
        try {
            java.util.List<User> users = userRepository.findAll();
            java.util.List<UserResponse> responses = new java.util.ArrayList<>();
            
            for (User user : users) {
                try {
                    UserResponse response = convertToUserResponse(user);
                    responses.add(response);
                } catch (Exception e) {
                    UserResponse errorResponse = new UserResponse();
                    errorResponse.setId(user.getId());
                    errorResponse.setUsername(user.getUsername());
                    errorResponse.setRole(user.getRole().toString());
                    errorResponse.setName("Error: " + e.getMessage());
                    responses.add(errorResponse);
                }
            }
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Debug Error: " + e.getMessage());
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
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User createdUser = adminService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(convertToUserResponse(createdUser));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating user: " + e.getMessage());
        }
    }

    /**
     * Update user details
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId, 
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            User updatedUser = adminService.updateUser(userId, request);
            return ResponseEntity.ok(convertToUserResponse(updatedUser));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating user: " + e.getMessage());
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
        response.setActive(user.getActive() != null ? user.getActive() : true);

        try {
            // Get profile-specific details
            if (user.getRole() == User.Role.STUDENT) {
                Student student = studentRepository.findById(user.getId()).orElse(null);
                if (student != null) {
                    response.setName(student.getName());
                    response.setEmail(student.getEmail());
                    response.setStudentId(student.getStudentId());
                    response.setDateOfBirth(student.getDateOfBirth());
                } else {
                    response.setName("Student Profile Missing");
                    response.setEmail("");
                }
            } else if (user.getRole() == User.Role.PROFESSOR) {
                Professor professor = professorRepository.findById(user.getId()).orElse(null);
                if (professor != null) {
                    response.setName(professor.getName());
                    response.setEmail(professor.getEmail());
                    response.setEmployeeId(professor.getEmployeeId());
                    response.setDepartment(professor.getDepartment());
                } else {
                    response.setName("Professor Profile Missing");
                    response.setEmail("");
                }
            } else if (user.getRole() == User.Role.ADMIN) {
                // For admin users, use username as name if no profile
                response.setName("Administrator (" + user.getUsername() + ")");
                response.setEmail(user.getUsername().contains("@") ? user.getUsername() : "");
            }
        } catch (Exception e) {
            // Fallback for any errors
            response.setName("User #" + user.getId());
            response.setEmail("");
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

    // ===============================
    // STUDENT MANAGEMENT ENDPOINTS
    // ===============================

    /**
     * Get all students with pagination and search (Phase 3)
     */
    @GetMapping("/students/detailed")
    public ResponseEntity<Page<StudentDetailResponse>> getAllStudentsDetailed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllStudents(page, size, sortBy, sortDir, search));
    }

    /**
     * Get student details with enrollment history
     */
    @GetMapping("/students/{studentId}/details")
    public ResponseEntity<StudentDetailResponse> getStudentDetails(@PathVariable Long studentId) {
        return ResponseEntity.ok(adminService.getStudentDetails(studentId));
    }

    /**
     * Update student information
     */
    @PutMapping("/students/{studentId}")
    public ResponseEntity<StudentDetailResponse> updateStudent(
            @PathVariable Long studentId,
            @RequestBody UpdateStudentRequest request) {
        return ResponseEntity.ok(adminService.updateStudent(studentId, request));
    }

    /**
     * Force enroll student in course (override capacity)
     */
    @PostMapping("/students/{studentId}/force-enroll/{courseId}")
    public ResponseEntity<String> forceEnrollStudent(
            @PathVariable Long studentId,
            @PathVariable Long courseId,
            @RequestParam(required = false) String reason) {
        adminService.forceEnrollStudent(studentId, courseId, reason);
        return ResponseEntity.ok("Student successfully force-enrolled");
    }

    /**
     * Force drop student from course
     */
    @DeleteMapping("/students/{studentId}/drop/{courseId}")
    public ResponseEntity<String> forceDropStudent(
            @PathVariable Long studentId,
            @PathVariable Long courseId,
            @RequestParam(required = false) String reason) {
        adminService.forceDropStudent(studentId, courseId, reason);
        return ResponseEntity.ok("Student successfully dropped from course");
    }

    // ===============================
    // GRADE MANAGEMENT ENDPOINTS
    // ===============================

    /**
     * Get all grades system-wide with pagination
     */
    @GetMapping("/grades")
    public ResponseEntity<Page<GradeResponse>> getAllGrades(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String courseCode,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String semester) {
        return ResponseEntity.ok(adminService.getAllGrades(page, size, sortBy, sortDir, courseCode, studentName, semester));
    }

    /**
     * Update/override any grade in the system
     */
    @PutMapping("/grades/{enrollmentId}")
    public ResponseEntity<GradeResponse> updateGrade(
            @PathVariable Long enrollmentId,
            @RequestBody UpdateGradeRequest request) {
        return ResponseEntity.ok(adminService.updateGrade(enrollmentId, request));
    }

    /**
     * Get grade analytics and reporting
     */
    @GetMapping("/grades/analytics")
    public ResponseEntity<GradeAnalyticsResponse> getGradeAnalytics(
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String courseCode) {
        return ResponseEntity.ok(adminService.getGradeAnalytics(semester, courseCode));
    }

    /**
     * Get course grade distribution
     */
    @GetMapping("/grades/distribution/{courseId}")
    public ResponseEntity<GradeDistributionResponse> getCourseGradeDistribution(@PathVariable Long courseId) {
        return ResponseEntity.ok(adminService.getCourseGradeDistribution(courseId));
    }

    // ===============================
    // SYSTEM ADMINISTRATION
    // ===============================

    /**
     * Get semester management data
     */
    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterResponse>> getAllSemesters() {
        return ResponseEntity.ok(adminService.getAllSemesters());
    }

    /**
     * Create new semester
     */
    @PostMapping("/semesters")
    public ResponseEntity<SemesterResponse> createSemester(@RequestBody CreateSemesterRequest request) {
        return ResponseEntity.ok(adminService.createSemester(request));
    }

    /**
     * Get department management data
     */
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(adminService.getAllDepartments());
    }

    /**
     * Create new department
     */
    @PostMapping("/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(@RequestBody CreateDepartmentRequest request) {
        return ResponseEntity.ok(adminService.createDepartment(request));
    }

    /**
     * Get comprehensive system statistics
     */
    @GetMapping("/system-stats")
    public ResponseEntity<SystemStatisticsResponse> getSystemStatistics() {
        return ResponseEntity.ok(adminService.getSystemStatistics());
    }

    /**
     * Get enrollment trends and analytics
     */
    @GetMapping("/enrollment-trends")
    public ResponseEntity<EnrollmentTrendsResponse> getEnrollmentTrends(
            @RequestParam(required = false) String timeRange) {
        return ResponseEntity.ok(adminService.getEnrollmentTrends(timeRange));
    }

    /**
     * Generate system reports
     */
    @GetMapping("/reports/{reportType}")
    public ResponseEntity<SystemReportResponse> generateReport(
            @PathVariable String reportType,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String department) {
        return ResponseEntity.ok(adminService.generateReport(reportType, semester, department));
    }
}
