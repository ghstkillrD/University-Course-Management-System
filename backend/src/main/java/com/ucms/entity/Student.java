package com.ucms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    private Long id; // Same ID as in User table (1-to-1 relationship)
    
    @Column(name = "student_id", unique = true, nullable = false, length = 20)
    private String studentId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
}