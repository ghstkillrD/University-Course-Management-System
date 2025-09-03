package com.ucms.controller;

import com.ucms.dto.*;
import com.ucms.entity.*;
import com.ucms.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"})
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // Student enrollment in course
    @PostMapping("/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(@RequestBody EnrollmentRequest request) {
        EnrollmentResponse enrollment = enrollmentService.enrollStudent(request.getCourseId());
        return ResponseEntity.ok(enrollment);
    }

    // Student drop course
    @DeleteMapping("/drop/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> dropCourse(@PathVariable Long courseId) {
        enrollmentService.dropCourse(courseId);
        return ResponseEntity.ok().build();
    }

    // Get current student's schedule
    @GetMapping("/my-schedule")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentScheduleResponse> getMySchedule() {
        StudentScheduleResponse schedule = enrollmentService.getStudentSchedule();
        return ResponseEntity.ok(schedule);
    }

    // Get current student's transcript
    @GetMapping("/my-transcript")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentTranscriptResponse> getMyTranscript() {
        StudentTranscriptResponse transcript = enrollmentService.getStudentTranscript();
        return ResponseEntity.ok(transcript);
    }

    // Get all enrollments with pagination (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EnrollmentResponse>> getAllEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<EnrollmentResponse> enrollments = enrollmentService.getAllEnrollments(page, size, sortBy, sortDir);
        return ResponseEntity.ok(enrollments);
    }

    // Get enrollments by student ID (Student own data + Admin)
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and #studentId == authentication.principal.profileId)")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
        return ResponseEntity.ok(enrollments);
    }

    // Get enrollments by course ID (Professor teaching course + Admin)
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PROFESSOR') and @courseService.isProfessorTeachingCourse(authentication.principal.profileId, #courseId))")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);
        return ResponseEntity.ok(enrollments);
    }

    // Force enroll student (admin override)
    @PostMapping("/force-enroll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponse> forceEnrollStudent(@RequestBody ForceEnrollmentRequest request) {
        EnrollmentResponse enrollment = enrollmentService.forceEnrollStudent(request.getStudentId(), request.getCourseId());
        return ResponseEntity.ok(enrollment);
    }

    // Drop student from course (admin override)
    @DeleteMapping("/force-drop/{studentId}/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> forceDropStudent(@PathVariable Long studentId, @PathVariable Long courseId) {
        enrollmentService.forceDropStudent(studentId, courseId);
        return ResponseEntity.ok().build();
    }

    // Update grade for enrollment (Professor teaching course + Admin)
    @PutMapping("/{enrollmentId}/grade")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PROFESSOR') and @enrollmentService.isProfessorTeachingEnrollment(authentication.principal.profileId, #enrollmentId))")
    public ResponseEntity<EnrollmentResponse> updateGrade(
            @PathVariable Long enrollmentId, 
            @RequestBody UpdateGradeRequest request) {
        EnrollmentResponse enrollment = enrollmentService.updateGrade(enrollmentId, request.getGrade());
        return ResponseEntity.ok(enrollment);
    }

    // Get student transcript (Student own data + Admin)
    @GetMapping("/transcript/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and #studentId == authentication.principal.profileId)")
    public ResponseEntity<StudentTranscriptResponse> getStudentTranscript(@PathVariable Long studentId) {
        StudentTranscriptResponse transcript = enrollmentService.getStudentTranscript(studentId);
        return ResponseEntity.ok(transcript);
    }

    // Search enrollments (Admin only)
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EnrollmentResponse>> searchEnrollments(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EnrollmentResponse> enrollments = enrollmentService.searchEnrollments(search, page, size);
        return ResponseEntity.ok(enrollments);
    }

    // Get enrollment statistics (Admin only)
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentStatsResponse> getEnrollmentStats() {
        EnrollmentStatsResponse stats = enrollmentService.getEnrollmentStats();
        return ResponseEntity.ok(stats);
    }

    // Get course enrollment details (Professor teaching course + Admin)
    @GetMapping("/course/{courseId}/details")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PROFESSOR') and @courseService.isProfessorTeachingCourse(authentication.principal.profileId, #courseId))")
    public ResponseEntity<CourseEnrollmentDetailsResponse> getCourseEnrollmentDetails(@PathVariable Long courseId) {
        CourseEnrollmentDetailsResponse details = enrollmentService.getCourseEnrollmentDetails(courseId);
        return ResponseEntity.ok(details);
    }
}
