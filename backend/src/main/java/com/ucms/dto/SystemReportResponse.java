package com.ucms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemReportResponse {
    private String reportType;
    private String title;
    private LocalDateTime generatedAt;
    private String semester;
    private String department;
    private Map<String, Object> summary;
    private List<ReportSection> sections;
    private String downloadUrl;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportSection {
        private String title;
        private String type; // "table", "chart", "summary"
        private Map<String, Object> data;
        private List<String> headers;
        private List<Map<String, Object>> rows;
    }
}
