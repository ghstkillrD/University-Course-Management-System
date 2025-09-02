package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGradeRequest {
    private String grade;
    private String comments; // Optional comments for grade update
}
