package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeAnalyticsResponse {
    private String semester;
    private String courseCode;
    private Integer totalGrades;
    private Double averageGPA;
    private Map<String, Integer> gradeDistribution; // A: 15, B: 20, etc.
    private Map<String, Double> gradePercentages;
    private Integer pendingGrades;
    private String highestGrade;
    private String lowestGrade;
    private Double passRate; // Percentage of non-F grades
    private Map<String, Double> departmentComparison; // Department average GPAs
}
