package com.ucms.repository;

import com.ucms.entity.Enrollment;
import com.ucms.entity.Student;
import com.ucms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(Student student);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourse(Course course);
    List<Enrollment> findByCourseId(Long courseId);
    List<Enrollment> findByCourseIdOrderByEnrollmentDateDesc(Long courseId);
    Optional<Enrollment> findByStudentAndCourse(Student student, Course course);
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.grade IS NOT NULL")
    List<Enrollment> findCompletedEnrollmentsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    Long countEnrollmentsByCourseId(@Param("courseId") Long courseId);
    
    // Additional methods for professor service
    int countByCourseId(Long courseId);
    int countByCourseIdAndGradeIsNull(Long courseId);
}