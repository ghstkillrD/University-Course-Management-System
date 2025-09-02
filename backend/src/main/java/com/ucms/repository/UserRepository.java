package com.ucms.repository;

import com.ucms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    // New methods for admin functionality
    Page<User> findByRole(User.Role role, Pageable pageable);
    long countByRole(User.Role role);
    
    // Search methods for filtering users
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN Student s ON u.id = s.id 
        LEFT JOIN Professor p ON u.id = p.id 
        WHERE (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(CAST(u.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(s.studentId) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(p.employeeId) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        """)
    Page<User> findBySearch(@Param("search") String search, Pageable pageable);
    
    @Query("""
        SELECT DISTINCT u FROM User u 
        LEFT JOIN Student s ON u.id = s.id 
        LEFT JOIN Professor p ON u.id = p.id 
        WHERE u.role = :role AND (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(CAST(u.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(s.studentId) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(p.employeeId) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        """)
    Page<User> findByRoleAndSearch(@Param("role") User.Role role, @Param("search") String search, Pageable pageable);
}