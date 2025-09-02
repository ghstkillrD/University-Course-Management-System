package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDepartmentRequest {
    private String name;
    private String code;
    private String description;
    private String headOfDepartment;
    private String contactEmail;
    private String location;
}
