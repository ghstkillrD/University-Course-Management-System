package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDetailResponse {
    private Long id;
    private String name;
    private String email;
    private String studentId;
    private String major;
    private String year;
    private Double gpa;
    private Integer totalCredits;
    private Integer completedCredits;
    private LocalDateTime enrollmentDate;
    private String status; // "Active", "Inactive", "Graduated", "Suspended"
    private List<EnrollmentSummary> currentEnrollments;
    private List<EnrollmentSummary> enrollmentHistory;
    private ContactInfo contactInfo;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrollmentSummary {
        private Long enrollmentId;
        private String courseCode;
        private String courseTitle;
        private String semester;
        private String grade;
        private String professorName;
        private LocalDateTime enrollmentDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactInfo {
        private String phone;
        private String address;
        private String emergencyContact;
        private String emergencyPhone;
    }
}
