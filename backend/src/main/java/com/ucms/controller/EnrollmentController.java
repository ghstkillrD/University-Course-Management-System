package com.ucms.controller;

import com.ucms.dto.*;
import com.ucms.entity.*;
import com.ucms.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // Get all enrollments with pagination
    @GetMapping
    public ResponseEntity<Page<EnrollmentResponse>> getAllEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<EnrollmentResponse> enrollments = enrollmentService.getAllEnrollments(page, size, sortBy, sortDir);
        return ResponseEntity.ok(enrollments);
    }

    // Get enrollments by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
        return ResponseEntity.ok(enrollments);
    }

    // Get enrollments by course ID
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);
        return ResponseEntity.ok(enrollments);
    }

    // Force enroll student (admin override)
    @PostMapping("/force-enroll")
    public ResponseEntity<EnrollmentResponse> forceEnrollStudent(@RequestBody ForceEnrollmentRequest request) {
        EnrollmentResponse enrollment = enrollmentService.forceEnrollStudent(request.getStudentId(), request.getCourseId());
        return ResponseEntity.ok(enrollment);
    }

    // Drop student from course (admin override)
    @DeleteMapping("/force-drop/{studentId}/{courseId}")
    public ResponseEntity<Void> forceDropStudent(@PathVariable Long studentId, @PathVariable Long courseId) {
        enrollmentService.forceDropStudent(studentId, courseId);
        return ResponseEntity.ok().build();
    }

    // Update grade for enrollment
    @PutMapping("/{enrollmentId}/grade")
    public ResponseEntity<EnrollmentResponse> updateGrade(
            @PathVariable Long enrollmentId, 
            @RequestBody UpdateGradeRequest request) {
        EnrollmentResponse enrollment = enrollmentService.updateGrade(enrollmentId, request.getGrade());
        return ResponseEntity.ok(enrollment);
    }

    // Get student transcript
    @GetMapping("/transcript/{studentId}")
    public ResponseEntity<StudentTranscriptResponse> getStudentTranscript(@PathVariable Long studentId) {
        StudentTranscriptResponse transcript = enrollmentService.getStudentTranscript(studentId);
        return ResponseEntity.ok(transcript);
    }

    // Search enrollments
    @GetMapping("/search")
    public ResponseEntity<Page<EnrollmentResponse>> searchEnrollments(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EnrollmentResponse> enrollments = enrollmentService.searchEnrollments(search, page, size);
        return ResponseEntity.ok(enrollments);
    }

    // Get enrollment statistics
    @GetMapping("/stats")
    public ResponseEntity<EnrollmentStatsResponse> getEnrollmentStats() {
        EnrollmentStatsResponse stats = enrollmentService.getEnrollmentStats();
        return ResponseEntity.ok(stats);
    }

    // Get course enrollment details
    @GetMapping("/course/{courseId}/details")
    public ResponseEntity<CourseEnrollmentDetailsResponse> getCourseEnrollmentDetails(@PathVariable Long courseId) {
        CourseEnrollmentDetailsResponse details = enrollmentService.getCourseEnrollmentDetails(courseId);
        return ResponseEntity.ok(details);
    }
}
