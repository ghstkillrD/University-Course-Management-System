package com.ucms.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Data
public class UpdateCourseRequest {
    @NotBlank(message = "Course title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Semester is required")
    @Size(max = 50, message = "Semester must be 50 characters or less")
    private String semester;
    
    private String scheduleInfo;
    
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
    
    private Long professorId;
}
