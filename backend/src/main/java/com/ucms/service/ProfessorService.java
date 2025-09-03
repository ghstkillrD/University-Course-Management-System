package com.ucms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucms.entity.Course;
import com.ucms.entity.Enrollment;
import com.ucms.entity.Professor;
import com.ucms.entity.Student;
import com.ucms.entity.User;
import com.ucms.repository.CourseRepository;
import com.ucms.repository.EnrollmentRepository;
import com.ucms.repository.ProfessorRepository;
import com.ucms.repository.StudentRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Map<String, Object> getProfessorStats(Long professorId) {
        Professor professor = professorRepository.findByUserId(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));

        List<Course> courses = courseRepository.findByProfessorId(professor.getId());
        
        // Count total students across all courses
        int totalStudents = courses.stream()
            .mapToInt(course -> enrollmentRepository.countByCourseId(course.getId()))
            .sum();

        // Count courses this semester (assuming current semester logic)
        String currentSemester = getCurrentSemester();
        int coursesThisSemester = (int) courses.stream()
            .filter(course -> course.getSemester().equals(currentSemester))
            .count();

        // Count pending grades (enrollments without grades)
        int pendingGrades = 0;
        for (Course course : courses) {
            pendingGrades += enrollmentRepository.countByCourseIdAndGradeIsNull(course.getId());
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courses.size());
        stats.put("totalStudents", totalStudents);
        stats.put("coursesThisSemester", coursesThisSemester);
        stats.put("pendingGrades", pendingGrades);

        return stats;
    }

    public List<Course> getProfessorCourses(Long professorId) {
        Professor professor = professorRepository.findByUserId(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));

        List<Course> courses = courseRepository.findByProfessorId(professor.getId());
        
        // Add enrollment count to each course
        for (Course course : courses) {
            int enrolledCount = enrollmentRepository.countByCourseId(course.getId());
            course.setAvailableSeats(course.getCapacity() - enrolledCount);
            // Set a temporary field for enrolled students count
            // Note: This is a workaround since we can't modify the entity directly
            // In a real implementation, you might want to create a DTO
        }
        
        return courses;
    }

    public Map<String, Object> getCourseRoster(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdOrderByEnrollmentDateDesc(courseId);
        
        List<Map<String, Object>> students = enrollments.stream().map(enrollment -> {
            Student student = enrollment.getStudent();
            
            Map<String, Object> studentInfo = new HashMap<>();
            studentInfo.put("id", student.getId());
            studentInfo.put("studentId", student.getStudentId());
            studentInfo.put("name", student.getName());
            studentInfo.put("email", student.getEmail());
            studentInfo.put("enrollmentDate", enrollment.getEnrollmentDate().toString());
            studentInfo.put("grade", enrollment.getGrade());
            studentInfo.put("enrollmentId", enrollment.getId());
            
            return studentInfo;
        }).collect(Collectors.toList());

        Map<String, Object> roster = new HashMap<>();
        roster.put("courseId", course.getId());
        roster.put("courseCode", course.getCode());
        roster.put("courseTitle", course.getTitle());
        roster.put("semester", course.getSemester());
        roster.put("students", students);
        roster.put("totalEnrolled", students.size());
        
        return roster;
    }

    public boolean isProfessorOfCourse(Long professorId, Long courseId) {
        Professor professor = professorRepository.findByUserId(professorId)
            .orElseThrow(() -> new RuntimeException("Professor not found"));
            
        Course course = courseRepository.findById(courseId)
            .orElse(null);
            
        return course != null && course.getProfessor().getId().equals(professor.getId());
    }

    public Course updateCourseDetails(Long courseId, Map<String, Object> updates) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        // Only allow professors to update limited fields
        if (updates.containsKey("description")) {
            course.setDescription((String) updates.get("description"));
        }
        
        if (updates.containsKey("scheduleInfo")) {
            // Note: scheduleInfo is not in our current Course entity
            // This would need to be added if schedule management is required
        }

        return courseRepository.save(course);
    }

    private String getCurrentSemester() {
        // Simple semester logic - you can make this more sophisticated
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue();
        
        if (month >= 1 && month <= 5) {
            return "Spring " + year;
        } else if (month >= 6 && month <= 8) {
            return "Summer " + year;
        } else {
            return "Fall " + year;
        }
    }
}
