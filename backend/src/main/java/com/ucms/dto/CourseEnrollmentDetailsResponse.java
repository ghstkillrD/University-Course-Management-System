package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseEnrollmentDetailsResponse {
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private String semester;
    private Integer capacity;
    private Integer enrolledStudents;
    private Integer availableSeats;
    private String professorName;
    private List<EnrolledStudent> students;
    private GradeDistribution gradeDistribution;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrolledStudent {
        private Long studentId;
        private String name;
        private String email;
        private String grade;
        private String enrollmentDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeDistribution {
        private Integer aGrades;
        private Integer bGrades;
        private Integer cGrades;
        private Integer dGrades;
        private Integer fGrades;
        private Integer pending;
    }
}
