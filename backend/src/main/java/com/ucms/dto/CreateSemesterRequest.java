package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSemesterRequest {
    private String name;
    private String code;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
}
