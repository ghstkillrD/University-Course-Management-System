package com.ucms.service;

import com.ucms.dto.CourseResponse;
import com.ucms.dto.CreateCourseRequest;
import com.ucms.dto.UpdateCourseRequest;
import com.ucms.entity.Course;
import com.ucms.entity.Professor;
import com.ucms.repository.CourseRepository;
import com.ucms.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    public Page<CourseResponse> getAllCourses(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Course> coursePage = courseRepository.findAll(pageable);
        return coursePage.map(this::convertToResponse);
    }

    public List<CourseResponse> getAllCoursesSimple() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public Optional<CourseResponse> getCourseById(Long id) {
        return courseRepository.findById(id)
            .map(this::convertToResponse);
    }

    public List<CourseResponse> getCoursesBySemester(String semester) {
        List<Course> courses = courseRepository.findBySemester(semester);
        return courses.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<CourseResponse> getCoursesByProfessor(Long professorId) {
        List<Course> courses = courseRepository.findByProfessorId(professorId);
        return courses.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public CourseResponse createCourse(CreateCourseRequest request) {
        // Check if course code already exists
        if (courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Course with code '" + request.getCode() + "' already exists");
        }

        Course course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setSemester(request.getSemester());
        course.setScheduleInfo(request.getScheduleInfo());
        course.setCapacity(request.getCapacity());
        course.setAvailableSeats(request.getCapacity()); // Initially all seats are available

        // Assign professor if provided
        if (request.getProfessorId() != null) {
            Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor not found with id: " + request.getProfessorId()));
            course.setProfessor(professor);
        }

        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }

    public CourseResponse updateCourse(Long id, UpdateCourseRequest request) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setSemester(request.getSemester());
        course.setScheduleInfo(request.getScheduleInfo());
        
        // Update capacity and available seats
        if (request.getCapacity() != null && !request.getCapacity().equals(course.getCapacity())) {
            int enrolledStudents = course.getCapacity() - course.getAvailableSeats();
            course.setCapacity(request.getCapacity());
            course.setAvailableSeats(Math.max(0, request.getCapacity() - enrolledStudents));
        }

        // Update professor assignment
        if (request.getProfessorId() != null) {
            Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor not found with id: " + request.getProfessorId()));
            course.setProfessor(professor);
        } else {
            course.setProfessor(null);
        }

        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Check if course has enrolled students
        int enrolledStudents = course.getCapacity() - course.getAvailableSeats();
        if (enrolledStudents > 0) {
            throw new RuntimeException("Cannot delete course with enrolled students. Please transfer students first.");
        }
        
        courseRepository.delete(course);
    }

    public Page<CourseResponse> searchCourses(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (search == null || search.trim().isEmpty()) {
            Page<Course> coursePage = courseRepository.findAll(pageable);
            return coursePage.map(this::convertToResponse);
        }
        
        // Use the new repository method to search by both code and title
        Page<Course> coursePage = courseRepository.findByCodeContainingIgnoreCaseOrTitleContainingIgnoreCase(
            search.trim(), pageable);
        return coursePage.map(this::convertToResponse);
    }

    private CourseResponse convertToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setSemester(course.getSemester());
        response.setScheduleInfo(course.getScheduleInfo());
        response.setCapacity(course.getCapacity());
        response.setAvailableSeats(course.getAvailableSeats());
        
        if (course.getProfessor() != null) {
            response.setProfessorId(course.getProfessor().getId());
            response.setProfessorName(course.getProfessor().getName());
            response.setProfessorEmail(course.getProfessor().getEmail());
        }
        
        return response;
    }
}
