package com.ucms.repository;

import com.ucms.entity.Course;
import com.ucms.entity.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findBySemester(String semester);
    List<Course> findByProfessor(Professor professor);
    List<Course> findByProfessorId(Long professorId);
    Optional<Course> findByCode(String code);
    List<Course> findByTitleContainingIgnoreCase(String title);
    boolean existsByCode(String code);
    
    // Search by both course code and title with pagination
    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Course> findByCodeContainingIgnoreCaseOrTitleContainingIgnoreCase(
        @Param("search") String search, Pageable pageable);
}