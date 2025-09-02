package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeDistributionResponse {
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private String semester;
    private String professorName;
    private Integer totalStudents;
    private Integer gradedStudents;
    private Integer pendingGrades;
    private Double courseAverageGPA;
    private Map<String, Integer> gradeCount; // A+: 2, A: 5, A-: 3, etc.
    private Map<String, Double> gradePercentage;
    private String medianGrade;
    private String modeGrade;
}
