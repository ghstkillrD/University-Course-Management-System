package com.ucms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Professor {
    @Id
    private Long id; // Same ID as in User table (1-to-1 relationship)
    
    @Column(name = "employee_id", unique = true, nullable = false, length = 20)
    private String employeeId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(length = 100)
    private String department;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;
}