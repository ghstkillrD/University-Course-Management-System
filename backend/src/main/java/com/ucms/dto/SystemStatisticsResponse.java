package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemStatisticsResponse {
    private UserStatistics userStats;
    private EnrollmentStatistics enrollmentStats;
    private CourseStatistics courseStats;
    private GradeStatistics gradeStats;
    private SystemHealth systemHealth;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStatistics {
        private Long totalUsers;
        private Long activeStudents;
        private Long activeProfessors;
        private Long admins;
        private Long newUsersThisMonth;
        private Map<String, Long> usersByDepartment;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrollmentStatistics {
        private Long totalEnrollments;
        private Long activeEnrollments;
        private Long completedEnrollments;
        private Long droppedEnrollments;
        private Map<String, Long> enrollmentsBySemester;
        private Double averageEnrollmentsPerStudent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseStatistics {
        private Long totalCourses;
        private Long activeCourses;
        private Long fullCapacityCourses;
        private Long underenrolledCourses;
        private Map<String, Long> coursesByDepartment;
        private Double averageClassSize;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeStatistics {
        private Long totalGrades;
        private Long pendingGrades;
        private Double systemGPA;
        private Map<String, Integer> gradeDistribution;
        private Double passRate;
        private Map<String, Double> gpaByDepartment;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemHealth {
        private String status; // "Healthy", "Warning", "Critical"
        private Integer capacityUtilization; // Percentage
        private Integer activeUsers;
        private String lastBackup;
        private String uptime;
    }
}
