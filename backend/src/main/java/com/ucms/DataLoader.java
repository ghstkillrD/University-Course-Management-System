package com.ucms;

import com.ucms.entity.User;
import com.ucms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing test users to ensure they have proper BCrypt encoding
        userRepository.findByUsername("admin").ifPresent(user -> userRepository.delete(user));
        userRepository.findByUsername("student").ifPresent(user -> userRepository.delete(user));
        userRepository.findByUsername("professor").ifPresent(user -> userRepository.delete(user));

        // Create default admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setActive(true);
        
        userRepository.save(admin);
        System.out.println("Default admin user created with username: admin, password: admin123");

        // Create test student
        User student = new User();
        student.setUsername("student");
        student.setPasswordHash(passwordEncoder.encode("student123"));
        student.setRole(User.Role.STUDENT);
        student.setCreatedAt(LocalDateTime.now());
        student.setActive(true);
        
        userRepository.save(student);
        System.out.println("Test student user created with username: student, password: student123");

        // Create test professor
        User professor = new User();
        professor.setUsername("professor");
        professor.setPasswordHash(passwordEncoder.encode("professor123"));
        professor.setRole(User.Role.PROFESSOR);
        professor.setCreatedAt(LocalDateTime.now());
        professor.setActive(true);
        
        userRepository.save(professor);
        System.out.println("Test professor user created with username: professor, password: professor123");
    }
}
