package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String headOfDepartment;
    private Integer totalProfessors;
    private Integer totalCourses;
    private Integer totalStudents;
    private String contactEmail;
    private String location;
}
