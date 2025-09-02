package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private String semester;
    private String professorName;
    private String grade;
    private LocalDateTime gradeUpdatedDate;
    private String gradeUpdatedBy;
    private String comments;
    private Integer credits;
    private Double gradePoints;
}
