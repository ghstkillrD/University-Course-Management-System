package com.ucms.repository;

import com.ucms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    // New methods for admin functionality
    Page<User> findByRole(User.Role role, Pageable pageable);
    long countByRole(User.Role role);
}