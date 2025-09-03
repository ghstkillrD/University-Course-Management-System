package com.ucms.repository;

import com.ucms.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmployeeId(String employeeId);
    Optional<Professor> findByEmail(String email);
    Optional<Professor> findByUserId(Long userId);
    List<Professor> findByDepartment(String department);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
}