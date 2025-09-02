package com.ucms.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private Long id;
    private String code;
    private String title;
    private String description;
    private String semester;
    private String scheduleInfo;
    private Integer capacity;
    private Integer availableSeats;
    private Long professorId;
    private String professorName;
    private String professorEmail;
}
