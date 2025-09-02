package com.ucms.controller;

import com.ucms.dto.CourseResponse;
import com.ucms.dto.CreateCourseRequest;
import com.ucms.dto.UpdateCourseRequest;
import com.ucms.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<CourseResponse>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<CourseResponse> courses = courseService.getAllCourses(page, size, sortBy, sortDir);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/simple")
    public ResponseEntity<List<CourseResponse>> getAllCoursesSimple() {
        List<CourseResponse> courses = courseService.getAllCoursesSimple();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
            .map(course -> ResponseEntity.ok().body(course))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<CourseResponse>> getCoursesBySemester(@PathVariable String semester) {
        List<CourseResponse> courses = courseService.getCoursesBySemester(semester);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<CourseResponse>> getCoursesByProfessor(@PathVariable Long professorId) {
        List<CourseResponse> courses = courseService.getCoursesByProfessor(professorId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CourseResponse>> searchCourses(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CourseResponse> courses = courseService.searchCourses(search, page, size);
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        try {
            CourseResponse course = courseService.createCourse(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(course);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateCourseRequest request) {
        try {
            CourseResponse course = courseService.updateCourse(id, request);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}