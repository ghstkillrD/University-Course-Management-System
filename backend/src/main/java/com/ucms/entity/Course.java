package com.ucms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 20)
    private String code;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, length = 50)
    private String semester;
    
    @Column(name = "schedule_info")
    private String scheduleInfo;
    
    @Column(columnDefinition = "int default 30")
    private Integer capacity = 30;
    
    @Column(name = "available_seats", columnDefinition = "int default 30")
    private Integer availableSeats = 30;
    
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;
}