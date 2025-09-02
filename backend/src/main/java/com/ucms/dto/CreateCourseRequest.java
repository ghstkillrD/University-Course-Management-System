package com.ucms.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Data
public class CreateCourseRequest {
    @NotBlank(message = "Course code is required")
    @Size(max = 20, message = "Course code must be 20 characters or less")
    private String code;
    
    @NotBlank(message = "Course title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Semester is required")
    @Size(max = 50, message = "Semester must be 50 characters or less")
    private String semester;
    
    private String scheduleInfo;
    
    @Positive(message = "Capacity must be positive")
    private Integer capacity = 30;
    
    private Long professorId;
}
