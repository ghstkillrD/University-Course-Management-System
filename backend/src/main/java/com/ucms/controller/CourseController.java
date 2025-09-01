package com.ucms.controller;

import com.ucms.entity.Course;
import com.ucms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
            .map(course -> ResponseEntity.ok().body(course))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<Course>> getCoursesBySemester(@PathVariable String semester) {
        List<Course> courses = courseRepository.findBySemester(semester);
        return ResponseEntity.ok(courses);
    }
}