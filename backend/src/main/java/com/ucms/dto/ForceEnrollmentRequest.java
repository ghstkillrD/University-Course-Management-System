package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForceEnrollmentRequest {
    private Long studentId;
    private Long courseId;
    private String reason; // Optional reason for force enrollment
}
