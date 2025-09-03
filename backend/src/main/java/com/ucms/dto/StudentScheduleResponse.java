package com.ucms.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentScheduleResponse {
    private List<EnrollmentResponse> enrollments;
    private int totalCredits;
    private Double gpa;
}
