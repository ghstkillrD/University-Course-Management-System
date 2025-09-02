package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SemesterResponse {
    private Long id;
    private String name; // "Fall 2024", "Spring 2025"
    private String code; // "F24", "S25"
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // "Current", "Past", "Future", "Planning"
    private Integer totalCourses;
    private Integer totalEnrollments;
    private Boolean isActive;
}
