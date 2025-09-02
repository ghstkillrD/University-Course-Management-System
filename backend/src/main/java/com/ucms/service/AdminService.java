package com.ucms.service;

import com.ucms.dto.*;
import com.ucms.entity.*;
import com.ucms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Create base User entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);

        // Save the user first to get the ID
        user = userRepository.save(user);

        // Create role-specific profile
        switch (user.getRole()) {
            case STUDENT:
                createStudentProfile(user, request);
                break;
            case PROFESSOR:
                createProfessorProfile(user, request);
                break;
            case ADMIN:
                // Admin doesn't need additional profile
                break;
        }

        return user;
    }

    @Transactional
    public User updateUser(Long userId, CreateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update base user fields
        user.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // Update role-specific profile
        switch (user.getRole()) {
            case STUDENT:
                updateStudentProfile(user, request);
                break;
            case PROFESSOR:
                updateProfessorProfile(user, request);
                break;
            case ADMIN:
                // Admin doesn't have additional profile
                break;
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update base user fields
        user.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        // Update role-specific profile
        switch (user.getRole()) {
            case STUDENT:
                updateStudentProfileFromUpdate(user, request);
                break;
            case PROFESSOR:
                updateProfessorProfileFromUpdate(user, request);
                break;
            case ADMIN:
                // Admin doesn't have additional profile
                break;
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete role-specific profile first (cascading should handle this, but being explicit)
        switch (user.getRole()) {
            case STUDENT:
                studentRepository.deleteById(userId);
                break;
            case PROFESSOR:
                professorRepository.deleteById(userId);
                break;
            case ADMIN:
                // No additional profile to delete
                break;
        }

        // Delete the user
        userRepository.delete(user);
    }

    private void createStudentProfile(User user, CreateUserRequest request) {
        Student student = new Student();
        student.setUser(user); // Set the user relationship instead of ID
        student.setStudentId(generateStudentId()); // Always auto-generate
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setMajor("Undeclared"); // Default major
        student.setYear("Freshman"); // Default year
        
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            student.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }

        studentRepository.save(student);
    }

    private void createProfessorProfile(User user, CreateUserRequest request) {
        Professor professor = new Professor();
        professor.setUser(user); // Set the user relationship instead of ID
        professor.setEmployeeId(generateEmployeeId()); // Always auto-generate
        professor.setName(request.getName());
        professor.setEmail(request.getEmail());
        professor.setDepartment(request.getDepartment());

        professorRepository.save(professor);
    }

    private void updateStudentProfile(User user, CreateUserRequest request) {
        Student student = studentRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        // Note: studentId is not updated as it's auto-generated and should remain constant
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            student.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }

        studentRepository.save(student);
    }

    private void updateProfessorProfile(User user, CreateUserRequest request) {
        Professor professor = professorRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Professor profile not found"));

        professor.setName(request.getName());
        professor.setEmail(request.getEmail());
        // Note: employeeId is not updated as it's auto-generated and should remain constant
        if (request.getDepartment() != null) {
            professor.setDepartment(request.getDepartment());
        }

        professorRepository.save(professor);
    }

    private String generateStudentId() {
        // Generate a unique student ID in STUXXXX format
        long count = userRepository.countByRole(User.Role.STUDENT);
        return "STU" + String.format("%04d", count + 1);
    }

    private String generateEmployeeId() {
        // Generate a unique employee ID in PROXXXX format  
        long count = userRepository.countByRole(User.Role.PROFESSOR);
        return "PRO" + String.format("%04d", count + 1);
    }

    private void updateStudentProfileFromUpdate(User user, UpdateUserRequest request) {
        Student student = studentRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        // Note: studentId is not updated as it's auto-generated and should remain constant
        if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
            student.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }

        studentRepository.save(student);
    }

    private void updateProfessorProfileFromUpdate(User user, UpdateUserRequest request) {
        Professor professor = professorRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Professor profile not found"));

        professor.setName(request.getName());
        professor.setEmail(request.getEmail());
        // Note: employeeId is not updated as it's auto-generated and should remain constant
        if (request.getDepartment() != null) {
            professor.setDepartment(request.getDepartment());
        }

        professorRepository.save(professor);
    }

    // ===============================
    // STUDENT MANAGEMENT METHODS
    // ===============================

    public Page<StudentDetailResponse> getAllStudents(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Student> students;
        if (search != null && !search.trim().isEmpty()) {
            // Search students by name, email, or student ID
            students = studentRepository.findBySearch(search.trim(), pageable);
        } else {
            students = studentRepository.findAll(pageable);
        }
        
        return students.map(this::convertToStudentDetailResponse);
    }

    public StudentDetailResponse getStudentDetails(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        return convertToStudentDetailResponse(student);
    }

    @Transactional
    public StudentDetailResponse updateStudent(Long studentId, UpdateStudentRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        // Update student information
        if (request.getName() != null) student.setName(request.getName());
        if (request.getEmail() != null) student.setEmail(request.getEmail());
        if (request.getMajor() != null) student.setMajor(request.getMajor());
        if (request.getYear() != null) student.setYear(request.getYear());
        
        Student savedStudent = studentRepository.save(student);
        return convertToStudentDetailResponse(savedStudent);
    }

    @Transactional
    public void forceEnrollStudent(Long studentId, Long courseId, String reason) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        // Check if already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        // Create enrollment (bypassing capacity restrictions)
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDateTime.now());

        // Update course capacity (even if it goes negative)
        course.setAvailableSeats(course.getAvailableSeats() - 1);
        courseRepository.save(course);
        enrollmentRepository.save(enrollment);

        // Log the force enrollment action
        // In production, you'd want an audit log
        System.out.println("ADMIN FORCE ENROLLMENT: Student " + studentId + " enrolled in course " + courseId + 
                          (reason != null ? " Reason: " + reason : ""));
    }

    @Transactional
    public void forceDropStudent(Long studentId, Long courseId, String reason) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Course course = enrollment.getCourse();
        course.setAvailableSeats(course.getAvailableSeats() + 1);
        courseRepository.save(course);
        enrollmentRepository.delete(enrollment);

        // Log the force drop action
        System.out.println("ADMIN FORCE DROP: Student " + studentId + " dropped from course " + courseId + 
                          (reason != null ? " Reason: " + reason : ""));
    }

    // ===============================
    // GRADE MANAGEMENT METHODS
    // ===============================

    public Page<GradeResponse> getAllGrades(int page, int size, String sortBy, String sortDir, 
                                           String courseCode, String studentName, String semester) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // In a real system, you'd implement custom repository queries for filtering
        Page<Enrollment> enrollments = enrollmentRepository.findAll(pageable);
        return enrollments.map(this::convertToGradeResponse);
    }

    @Transactional
    public GradeResponse updateGrade(Long enrollmentId, UpdateGradeRequest request) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        // Validate grade
        if (request.getGrade() != null && !isValidGrade(request.getGrade())) {
            throw new RuntimeException("Invalid grade: " + request.getGrade());
        }

        enrollment.setGrade(request.getGrade());
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        // Log grade override
        System.out.println("ADMIN GRADE OVERRIDE: Enrollment " + enrollmentId + " grade updated to " + request.getGrade() +
                          (request.getComments() != null ? " Comments: " + request.getComments() : ""));

        return convertToGradeResponse(savedEnrollment);
    }

    public GradeAnalyticsResponse getGradeAnalytics(String semester, String courseCode) {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        
        // Filter by semester and course code if provided
        if (semester != null) {
            enrollments = enrollments.stream()
                    .filter(e -> semester.equals(e.getCourse().getSemester()))
                    .collect(Collectors.toList());
        }
        if (courseCode != null) {
            enrollments = enrollments.stream()
                    .filter(e -> courseCode.equals(e.getCourse().getCode()))
                    .collect(Collectors.toList());
        }

        // Calculate analytics
        Map<String, Integer> gradeDistribution = new HashMap<>();
        List<String> validGrades = Arrays.asList("A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F");
        validGrades.forEach(grade -> gradeDistribution.put(grade, 0));

        int totalGrades = 0;
        double totalGradePoints = 0;
        int pendingGrades = 0;

        for (Enrollment enrollment : enrollments) {
            String grade = enrollment.getGrade();
            if (grade == null) {
                pendingGrades++;
            } else {
                gradeDistribution.put(grade, gradeDistribution.getOrDefault(grade, 0) + 1);
                totalGradePoints += getGradePoints(grade);
                totalGrades++;
            }
        }

        double averageGPA = totalGrades > 0 ? totalGradePoints / totalGrades : 0.0;
        double passRate = totalGrades > 0 ? 
            (double) enrollments.stream().filter(e -> e.getGrade() != null && !e.getGrade().equals("F")).collect(Collectors.toList()).size() / totalGrades * 100 : 0.0;

        // Calculate percentages
        Map<String, Double> gradePercentages = new HashMap<>();
        for (Map.Entry<String, Integer> entry : gradeDistribution.entrySet()) {
            double percentage = totalGrades > 0 ? (double) entry.getValue() / totalGrades * 100 : 0.0;
            gradePercentages.put(entry.getKey(), Math.round(percentage * 100.0) / 100.0);
        }

        GradeAnalyticsResponse analytics = new GradeAnalyticsResponse();
        analytics.setSemester(semester);
        analytics.setCourseCode(courseCode);
        analytics.setTotalGrades(totalGrades);
        analytics.setAverageGPA(Math.round(averageGPA * 100.0) / 100.0);
        analytics.setGradeDistribution(gradeDistribution);
        analytics.setGradePercentages(gradePercentages);
        analytics.setPendingGrades(pendingGrades);
        analytics.setPassRate(Math.round(passRate * 100.0) / 100.0);

        return analytics;
    }

    public GradeDistributionResponse getCourseGradeDistribution(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        
        Map<String, Integer> gradeCount = new HashMap<>();
        List<String> validGrades = Arrays.asList("A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F");
        validGrades.forEach(grade -> gradeCount.put(grade, 0));

        int totalStudents = enrollments.size();
        int gradedStudents = 0;
        double totalGradePoints = 0;

        for (Enrollment enrollment : enrollments) {
            String grade = enrollment.getGrade();
            if (grade != null) {
                gradeCount.put(grade, gradeCount.getOrDefault(grade, 0) + 1);
                totalGradePoints += getGradePoints(grade);
                gradedStudents++;
            }
        }

        double courseAverageGPA = gradedStudents > 0 ? totalGradePoints / gradedStudents : 0.0;

        // Calculate percentages
        Map<String, Double> gradePercentage = new HashMap<>();
        for (Map.Entry<String, Integer> entry : gradeCount.entrySet()) {
            double percentage = gradedStudents > 0 ? (double) entry.getValue() / gradedStudents * 100 : 0.0;
            gradePercentage.put(entry.getKey(), Math.round(percentage * 100.0) / 100.0);
        }

        GradeDistributionResponse distribution = new GradeDistributionResponse();
        distribution.setCourseId(courseId);
        distribution.setCourseCode(course.getCode());
        distribution.setCourseTitle(course.getTitle());
        distribution.setSemester(course.getSemester());
        distribution.setProfessorName(course.getProfessor() != null ? course.getProfessor().getName() : "TBA");
        distribution.setTotalStudents(totalStudents);
        distribution.setGradedStudents(gradedStudents);
        distribution.setPendingGrades(totalStudents - gradedStudents);
        distribution.setCourseAverageGPA(Math.round(courseAverageGPA * 100.0) / 100.0);
        distribution.setGradeCount(gradeCount);
        distribution.setGradePercentage(gradePercentage);

        return distribution;
    }

    // ===============================
    // SYSTEM ADMINISTRATION METHODS
    // ===============================

    public List<SemesterResponse> getAllSemesters() {
        // In a real system, you'd have a Semester entity
        // For now, we'll return semesters based on existing courses
        List<Course> courses = courseRepository.findAll();
        Set<String> semesterNames = courses.stream()
                .map(Course::getSemester)
                .collect(Collectors.toSet());

        return semesterNames.stream()
                .map(semesterName -> {
                    SemesterResponse semester = new SemesterResponse();
                    semester.setName(semesterName);
                    semester.setCode(generateSemesterCode(semesterName));
                    semester.setTotalCourses((int) courses.stream().filter(c -> semesterName.equals(c.getSemester())).count());
                    semester.setIsActive(true); // Simplified logic
                    return semester;
                })
                .collect(Collectors.toList());
    }

    public SemesterResponse createSemester(CreateSemesterRequest request) {
        // In a real system, you'd save to a Semester entity
        SemesterResponse semester = new SemesterResponse();
        semester.setName(request.getName());
        semester.setCode(request.getCode());
        semester.setStartDate(request.getStartDate());
        semester.setEndDate(request.getEndDate());
        semester.setIsActive(request.getIsActive());
        semester.setTotalCourses(0);
        semester.setTotalEnrollments(0);
        return semester;
    }

    public List<DepartmentResponse> getAllDepartments() {
        // In a real system, you'd have a Department entity
        // For now, we'll return departments based on existing professors
        List<Professor> professors = professorRepository.findAll();
        Map<String, List<Professor>> professorsByDepartment = professors.stream()
                .collect(Collectors.groupingBy(Professor::getDepartment));

        return professorsByDepartment.entrySet().stream()
                .map(entry -> {
                    DepartmentResponse dept = new DepartmentResponse();
                    dept.setName(entry.getKey());
                    dept.setCode(generateDepartmentCode(entry.getKey()));
                    dept.setTotalProfessors(entry.getValue().size());
                    return dept;
                })
                .collect(Collectors.toList());
    }

    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {
        // In a real system, you'd save to a Department entity
        DepartmentResponse department = new DepartmentResponse();
        department.setName(request.getName());
        department.setCode(request.getCode());
        department.setDescription(request.getDescription());
        department.setHeadOfDepartment(request.getHeadOfDepartment());
        department.setContactEmail(request.getContactEmail());
        department.setLocation(request.getLocation());
        department.setTotalProfessors(0);
        department.setTotalCourses(0);
        department.setTotalStudents(0);
        return department;
    }

    public SystemStatisticsResponse getSystemStatistics() {
        // User statistics
        long totalUsers = userRepository.count();
        long activeStudents = studentRepository.count();
        long activeProfessors = professorRepository.count();
        long admins = userRepository.countByRole(User.Role.ADMIN);

        SystemStatisticsResponse.UserStatistics userStats = new SystemStatisticsResponse.UserStatistics();
        userStats.setTotalUsers(totalUsers);
        userStats.setActiveStudents(activeStudents);
        userStats.setActiveProfessors(activeProfessors);
        userStats.setAdmins(admins);
        userStats.setNewUsersThisMonth(0L); // Would need date filtering

        // Enrollment statistics
        long totalEnrollments = enrollmentRepository.count();
        long completedEnrollments = enrollmentRepository.findAll().stream()
                .filter(e -> e.getGrade() != null)
                .collect(Collectors.toList()).size();
        long activeEnrollments = totalEnrollments - completedEnrollments;

        SystemStatisticsResponse.EnrollmentStatistics enrollmentStats = new SystemStatisticsResponse.EnrollmentStatistics();
        enrollmentStats.setTotalEnrollments(totalEnrollments);
        enrollmentStats.setActiveEnrollments(activeEnrollments);
        enrollmentStats.setCompletedEnrollments(completedEnrollments);
        enrollmentStats.setAverageEnrollmentsPerStudent(activeStudents > 0 ? (double) totalEnrollments / activeStudents : 0.0);

        // Course statistics
        long totalCourses = courseRepository.count();
        long fullCapacityCourses = courseRepository.findAll().stream()
                .filter(c -> c.getAvailableSeats() <= 0)
                .count();

        SystemStatisticsResponse.CourseStatistics courseStats = new SystemStatisticsResponse.CourseStatistics();
        courseStats.setTotalCourses(totalCourses);
        courseStats.setActiveCourses(totalCourses);
        courseStats.setFullCapacityCourses(fullCapacityCourses);

        // Grade statistics
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        long totalGrades = allEnrollments.stream().filter(e -> e.getGrade() != null).count();
        long pendingGrades = totalEnrollments - totalGrades;

        SystemStatisticsResponse.GradeStatistics gradeStats = new SystemStatisticsResponse.GradeStatistics();
        gradeStats.setTotalGrades(totalGrades);
        gradeStats.setPendingGrades(pendingGrades);

        // System health
        SystemStatisticsResponse.SystemHealth systemHealth = new SystemStatisticsResponse.SystemHealth();
        systemHealth.setStatus("Healthy");
        systemHealth.setActiveUsers((int) totalUsers);

        SystemStatisticsResponse response = new SystemStatisticsResponse();
        response.setUserStats(userStats);
        response.setEnrollmentStats(enrollmentStats);
        response.setCourseStats(courseStats);
        response.setGradeStats(gradeStats);
        response.setSystemHealth(systemHealth);

        return response;
    }

    public EnrollmentTrendsResponse getEnrollmentTrends(String timeRange) {
        // Simplified implementation - in production, you'd analyze historical data
        EnrollmentTrendsResponse trends = new EnrollmentTrendsResponse();
        trends.setTimeRange(timeRange != null ? timeRange : "6-months");
        
        // Generate sample trend data
        List<EnrollmentTrendsResponse.TrendData> enrollmentTrends = new ArrayList<>();
        enrollmentTrends.add(new EnrollmentTrendsResponse.TrendData("Jan 2024", 150L, 15.0, "Monthly"));
        enrollmentTrends.add(new EnrollmentTrendsResponse.TrendData("Feb 2024", 180L, 18.0, "Monthly"));
        enrollmentTrends.add(new EnrollmentTrendsResponse.TrendData("Mar 2024", 200L, 20.0, "Monthly"));
        
        trends.setEnrollmentTrends(enrollmentTrends);
        return trends;
    }

    public SystemReportResponse generateReport(String reportType, String semester, String department) {
        SystemReportResponse report = new SystemReportResponse();
        report.setReportType(reportType);
        report.setGeneratedAt(LocalDateTime.now());
        report.setSemester(semester);
        report.setDepartment(department);

        switch (reportType.toLowerCase()) {
            case "enrollment":
                report.setTitle("Enrollment Report");
                // Generate enrollment report data
                break;
            case "grades":
                report.setTitle("Grade Distribution Report");
                // Generate grade report data
                break;
            case "attendance":
                report.setTitle("Attendance Report");
                // Generate attendance report data
                break;
            default:
                report.setTitle("System Overview Report");
        }

        return report;
    }

    // ===============================
    // HELPER METHODS
    // ===============================

    private StudentDetailResponse convertToStudentDetailResponse(Student student) {
        StudentDetailResponse response = new StudentDetailResponse();
        response.setId(student.getId());
        response.setName(student.getName());
        response.setEmail(student.getEmail());
        response.setStudentId(student.getStudentId());
        response.setMajor(student.getMajor() != null ? student.getMajor() : "Undeclared");
        response.setYear(student.getYear() != null ? student.getYear() : "Freshman");
        response.setStatus("Active"); // Simplified

        // Get enrollments
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        
        List<StudentDetailResponse.EnrollmentSummary> currentEnrollments = enrollments.stream()
                .filter(e -> e.getGrade() == null) // Current enrollments
                .map(this::convertToEnrollmentSummary)
                .collect(Collectors.toList());

        List<StudentDetailResponse.EnrollmentSummary> enrollmentHistory = enrollments.stream()
                .filter(e -> e.getGrade() != null) // Completed enrollments
                .map(this::convertToEnrollmentSummary)
                .collect(Collectors.toList());

        response.setCurrentEnrollments(currentEnrollments);
        response.setEnrollmentHistory(enrollmentHistory);

        // Calculate GPA
        double totalGradePoints = 0;
        int completedCredits = 0;
        for (Enrollment enrollment : enrollments) {
            if (enrollment.getGrade() != null) {
                totalGradePoints += getGradePoints(enrollment.getGrade()) * 3; // Assuming 3 credits per course
                completedCredits += 3;
            }
        }
        response.setGpa(completedCredits > 0 ? Math.round((totalGradePoints / completedCredits) * 100.0) / 100.0 : 0.0);
        response.setCompletedCredits(completedCredits);
        response.setTotalCredits(enrollments.size() * 3);

        return response;
    }

    private StudentDetailResponse.EnrollmentSummary convertToEnrollmentSummary(Enrollment enrollment) {
        StudentDetailResponse.EnrollmentSummary summary = new StudentDetailResponse.EnrollmentSummary();
        summary.setEnrollmentId(enrollment.getId());
        summary.setCourseCode(enrollment.getCourse().getCode());
        summary.setCourseTitle(enrollment.getCourse().getTitle());
        summary.setSemester(enrollment.getCourse().getSemester());
        summary.setGrade(enrollment.getGrade());
        summary.setProfessorName(enrollment.getCourse().getProfessor() != null ? 
                enrollment.getCourse().getProfessor().getName() : "TBA");
        summary.setEnrollmentDate(enrollment.getEnrollmentDate());
        return summary;
    }

    private GradeResponse convertToGradeResponse(Enrollment enrollment) {
        GradeResponse response = new GradeResponse();
        response.setEnrollmentId(enrollment.getId());
        response.setStudentId(enrollment.getStudent().getId());
        response.setStudentName(enrollment.getStudent().getName());
        response.setStudentEmail(enrollment.getStudent().getEmail());
        response.setCourseId(enrollment.getCourse().getId());
        response.setCourseCode(enrollment.getCourse().getCode());
        response.setCourseTitle(enrollment.getCourse().getTitle());
        response.setSemester(enrollment.getCourse().getSemester());
        response.setProfessorName(enrollment.getCourse().getProfessor() != null ? 
                enrollment.getCourse().getProfessor().getName() : "TBA");
        response.setGrade(enrollment.getGrade());
        response.setCredits(3); // Assuming 3 credits per course
        response.setGradePoints(enrollment.getGrade() != null ? getGradePoints(enrollment.getGrade()) : 0.0);
        return response;
    }

    private boolean isValidGrade(String grade) {
        Set<String> validGrades = Set.of("A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F");
        return validGrades.contains(grade.toUpperCase());
    }

    private double getGradePoints(String grade) {
        if (grade == null) return 0.0;
        switch (grade.toUpperCase()) {
            case "A+": case "A": return 4.0;
            case "A-": return 3.7;
            case "B+": return 3.3;
            case "B": return 3.0;
            case "B-": return 2.7;
            case "C+": return 2.3;
            case "C": return 2.0;
            case "C-": return 1.7;
            case "D+": return 1.3;
            case "D": return 1.0;
            case "D-": return 0.7;
            case "F": return 0.0;
            default: return 0.0;
        }
    }

    private String generateSemesterCode(String semesterName) {
        // Simple code generation - you'd want more sophisticated logic
        if (semesterName.toLowerCase().contains("fall")) {
            return "F" + semesterName.substring(semesterName.length() - 2);
        } else if (semesterName.toLowerCase().contains("spring")) {
            return "S" + semesterName.substring(semesterName.length() - 2);
        } else if (semesterName.toLowerCase().contains("summer")) {
            return "U" + semesterName.substring(semesterName.length() - 2);
        }
        return semesterName.substring(0, Math.min(3, semesterName.length())).toUpperCase();
    }

    private String generateDepartmentCode(String departmentName) {
        return departmentName.substring(0, Math.min(4, departmentName.length())).toUpperCase();
    }
}
