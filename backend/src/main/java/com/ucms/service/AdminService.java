package com.ucms.service;

import com.ucms.dto.CreateUserRequest;
import com.ucms.entity.Professor;
import com.ucms.entity.Student;
import com.ucms.entity.User;
import com.ucms.repository.ProfessorRepository;
import com.ucms.repository.StudentRepository;
import com.ucms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Create base User entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);

        // Save the user first to get the ID
        user = userRepository.save(user);

        // Create role-specific profile
        switch (user.getRole()) {
            case STUDENT:
                createStudentProfile(user, request);
                break;
            case PROFESSOR:
                createProfessorProfile(user, request);
                break;
            case ADMIN:
                // Admin doesn't need additional profile
                break;
        }

        return user;
    }

    @Transactional
    public User updateUser(Long userId, CreateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update base user fields
        user.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // Update role-specific profile
        switch (user.getRole()) {
            case STUDENT:
                updateStudentProfile(user, request);
                break;
            case PROFESSOR:
                updateProfessorProfile(user, request);
                break;
            case ADMIN:
                // Admin doesn't have additional profile
                break;
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete role-specific profile first (cascading should handle this, but being explicit)
        switch (user.getRole()) {
            case STUDENT:
                studentRepository.deleteById(userId);
                break;
            case PROFESSOR:
                professorRepository.deleteById(userId);
                break;
            case ADMIN:
                // No additional profile to delete
                break;
        }

        // Delete the user
        userRepository.delete(user);
    }

    private void createStudentProfile(User user, CreateUserRequest request) {
        Student student = new Student();
        student.setUser(user); // Set the user relationship instead of ID
        student.setStudentId(generateStudentId()); // Always auto-generate
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            student.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }

        studentRepository.save(student);
    }

    private void createProfessorProfile(User user, CreateUserRequest request) {
        Professor professor = new Professor();
        professor.setUser(user); // Set the user relationship instead of ID
        professor.setEmployeeId(generateEmployeeId()); // Always auto-generate
        professor.setName(request.getName());
        professor.setEmail(request.getEmail());
        professor.setDepartment(request.getDepartment());

        professorRepository.save(professor);
    }

    private void updateStudentProfile(User user, CreateUserRequest request) {
        Student student = studentRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        // Note: studentId is not updated as it's auto-generated and should remain constant
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            student.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }

        studentRepository.save(student);
    }

    private void updateProfessorProfile(User user, CreateUserRequest request) {
        Professor professor = professorRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Professor profile not found"));

        professor.setName(request.getName());
        professor.setEmail(request.getEmail());
        // Note: employeeId is not updated as it's auto-generated and should remain constant
        if (request.getDepartment() != null) {
            professor.setDepartment(request.getDepartment());
        }

        professorRepository.save(professor);
    }

    private String generateStudentId() {
        // Generate a unique student ID in STUXXXX format
        long count = userRepository.countByRole(User.Role.STUDENT);
        return "STU" + String.format("%04d", count + 1);
    }

    private String generateEmployeeId() {
        // Generate a unique employee ID in PROXXXX format  
        long count = userRepository.countByRole(User.Role.PROFESSOR);
        return "PRO" + String.format("%04d", count + 1);
    }
}
