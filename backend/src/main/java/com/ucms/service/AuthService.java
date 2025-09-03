package com.ucms.service;

import com.ucms.dto.LoginRequest;
import com.ucms.dto.LoginResponse;
import com.ucms.dto.StudentRegistrationRequest;
import com.ucms.dto.UserInfo;
import com.ucms.entity.User;
import com.ucms.entity.Student;
import com.ucms.repository.UserRepository;
import com.ucms.repository.StudentRepository;
import com.ucms.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserInfo userInfo = getCurrentUserInfo();
        return new LoginResponse(jwt, userInfo);
    }

    @Transactional
    public UserInfo registerStudent(StudentRegistrationRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (studentRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (studentRepository.existsByStudentId(signUpRequest.getStudentId())) {
            throw new RuntimeException("Error: Student ID is already in use!");
        }        // Create new user account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(User.Role.STUDENT);

        User savedUser = userRepository.save(user);

        // Create student profile
        Student student = new Student();
        student.setId(savedUser.getId());
        student.setStudentId(signUpRequest.getStudentId());
        student.setName(signUpRequest.getName());
        student.setEmail(signUpRequest.getEmail());
        student.setDateOfBirth(signUpRequest.getDateOfBirth());
        student.setUser(savedUser);

        studentRepository.save(student);

        return new UserInfo(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getRole(),
            student.getId(),
            student.getName(),
            student.getEmail()
        );
    }

    public UserInfo getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getPrincipal().equals("anonymousUser")) {
            
            String username = authentication.getName();
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Get role-specific information
                String name = "Unknown";
                String email = "";
                
                if (user.getRole() == User.Role.STUDENT) {
                    Optional<Student> student = studentRepository.findById(user.getId());
                    if (student.isPresent()) {
                        name = student.get().getName();
                        email = student.get().getEmail();
                    }
                } else if (user.getRole() == User.Role.PROFESSOR) {
                    // Get professor details if needed
                    name = "Professor " + user.getUsername();
                    email = user.getUsername() + "@university.edu";
                } else if (user.getRole() == User.Role.ADMIN) {
                    name = "Admin " + user.getUsername();
                    email = user.getUsername() + "@university.edu";
                }
                
                return new UserInfo(
                    user.getId(),
                    user.getUsername(),
                    user.getRole(),
                    user.getId(),  // Using user ID as external ID
                    name,
                    email
                );
            }
        }
        return null;
    }
}