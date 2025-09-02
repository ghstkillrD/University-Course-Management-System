package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStudentRequest {
    private String name;
    private String email;
    private String major;
    private String year;
    private String status;
    private String phone;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
}
