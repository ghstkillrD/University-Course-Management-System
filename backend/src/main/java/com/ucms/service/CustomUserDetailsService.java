package com.ucms.service;

import com.ucms.entity.User;
import com.ucms.entity.Student;
import com.ucms.entity.Professor;
import com.ucms.repository.UserRepository;
import com.ucms.repository.StudentRepository;
import com.ucms.repository.ProfessorRepository;
import com.ucms.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));        Long profileId = null;
        if (user.getRole() == User.Role.STUDENT) {
            Student student = studentRepository.findById(user.getId()).orElse(null);
            profileId = student != null ? student.getId() : null;
        } else if (user.getRole() == User.Role.PROFESSOR || user.getRole() == User.Role.ADMIN) {
            Professor professor = professorRepository.findById(user.getId()).orElse(null);
            profileId = professor != null ? professor.getId() : null;
        }

        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getPasswordHash(),
            user.getRole(),
            profileId
        );
    }
}