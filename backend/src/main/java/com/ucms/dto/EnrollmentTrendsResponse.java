package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentTrendsResponse {
    private String timeRange;
    private List<TrendData> enrollmentTrends;
    private List<TrendData> gradeTrends;
    private Map<String, List<TrendData>> departmentTrends;
    private PeakEnrollmentData peakEnrollment;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendData {
        private String period; // "2024-01", "Fall 2024", etc.
        private Long count;
        private Double percentage;
        private String category;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeakEnrollmentData {
        private String period;
        private Long peakEnrollments;
        private String mostPopularCourse;
        private String trend; // "Increasing", "Decreasing", "Stable"
    }
}
