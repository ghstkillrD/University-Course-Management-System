package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentTranscriptResponse {
    private Long studentId;
    private String studentName;
    private String email;
    private String major;
    private Double gpa;
    private Integer totalCredits;
    private Integer completedCredits;
    private List<TranscriptEntry> courses;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TranscriptEntry {
        private String courseCode;
        private String courseTitle;
        private String semester;
        private String grade;
        private Integer credits;
        private String professorName;
    }
}
