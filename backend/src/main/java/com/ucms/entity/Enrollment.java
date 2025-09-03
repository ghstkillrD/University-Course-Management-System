package com.ucms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "enrollment_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime enrollmentDate = LocalDateTime.now();
    
    @Column(length = 5)
    private String grade;
    
    // Additional grade components
    @Column(name = "midterm_grade", length = 5)
    private String midtermGrade;
    
    @Column(name = "final_grade", length = 5)
    private String finalGrade;
    
    @Column(name = "attendance")
    private Double attendance;
    
    @Column(name = "participation_score")
    private Double participationScore;
    
    @Column(name = "comments", length = 1000)
    private String comments;
}