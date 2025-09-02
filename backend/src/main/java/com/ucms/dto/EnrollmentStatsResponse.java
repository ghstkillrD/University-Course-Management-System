package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentStatsResponse {
    private Long totalEnrollments;
    private Long activeEnrollments;
    private Long completedEnrollments;
    private Long pendingGrades;
    private Double averageGradePoints;
    private Long totalStudents;
    private Long totalCourses;
    private Long coursesWithFullCapacity;
    private Long studentsWithoutEnrollments;
}
