package com.ucms;

import com.ucms.entity.User;
import com.ucms.entity.Student;
import com.ucms.entity.Professor;
import com.ucms.entity.Course;
import com.ucms.repository.UserRepository;
import com.ucms.repository.StudentRepository;
import com.ucms.repository.ProfessorRepository;
import com.ucms.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Only initialize if no users exist (fresh database)
        if (userRepository.count() > 0) {
            System.out.println("Database already initialized, skipping data loading");
            return;
        }

        System.out.println("Initializing fresh database with test data...");

        // Create default admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setActive(true);
        
        userRepository.save(admin);
        System.out.println("Default admin user created with username: admin, password: admin123");

        // Create test student
        User studentUser = new User();
        studentUser.setUsername("student");
        studentUser.setPasswordHash(passwordEncoder.encode("student123"));
        studentUser.setRole(User.Role.STUDENT);
        studentUser.setCreatedAt(LocalDateTime.now());
        studentUser.setActive(true);
        
        studentUser = userRepository.save(studentUser);
        
        // Create Student profile
        Student student = new Student();
        student.setUser(studentUser);
        student.setStudentId("STU" + studentUser.getId());
        student.setName("Student");
        student.setEmail("student@university.edu");
        student.setMajor("Computer Science");
        student.setYear("Sophomore");
        
        studentRepository.save(student);
        System.out.println("Test student user created with username: student, password: student123");

        // Create test professor
        User professorUser = new User();
        professorUser.setUsername("professor");
        professorUser.setPasswordHash(passwordEncoder.encode("professor123"));
        professorUser.setRole(User.Role.PROFESSOR);
        professorUser.setCreatedAt(LocalDateTime.now());
        professorUser.setActive(true);
        
        professorUser = userRepository.save(professorUser);
        
        // Create Professor profile
        Professor professor = new Professor();
        professor.setUser(professorUser);
        professor.setEmployeeId("PROF" + professorUser.getId());
        professor.setName("Professor");
        professor.setEmail("professor@university.edu");
        professor.setDepartment("Computer Science");
        
        professorRepository.save(professor);
        System.out.println("Test professor user created with username: professor, password: professor123");

        // Create prof2 user for frontend testing
        User prof2User = new User();
        prof2User.setUsername("prof2");
        prof2User.setPasswordHash(passwordEncoder.encode("prof123"));
        prof2User.setRole(User.Role.PROFESSOR);
        prof2User.setCreatedAt(LocalDateTime.now());
        prof2User.setActive(true);
        
        prof2User = userRepository.save(prof2User);
        
        // Create Professor profile for prof2
        Professor prof2 = new Professor();
        prof2.setUser(prof2User);
        prof2.setEmployeeId("PROF" + prof2User.getId());
        prof2.setName("Professor prof2");
        prof2.setEmail("prof2@university.edu");
        prof2.setDepartment("Computer Science");
        
        Professor savedProf2 = professorRepository.save(prof2);
        System.out.println("Test prof2 user created with username: prof2, password: prof123");

        // Create sample courses
        createSampleCourses(savedProf2);
    }

    private void createSampleCourses(Professor professor) {
        // Create sample courses taught by the professor
        Course course1 = new Course();
        course1.setCode("CS101");
        course1.setTitle("Intro to CS");
        course1.setDescription("Introduction to Computer Science");
        course1.setSemester("Fall 2025");
        course1.setCapacity(30);
        course1.setAvailableSeats(30);
        course1.setProfessor(professor);
        course1.setScheduleInfo("Mon/Wed/Fri 10:00-11:00 AM");
        courseRepository.save(course1);

        Course course2 = new Course();
        course2.setCode("CS102");
        course2.setTitle("Intro to Networking");
        course2.setDescription("Introduction to Computer Networking");
        course2.setSemester("Fall 2025");
        course2.setCapacity(25);
        course2.setAvailableSeats(25);
        course2.setProfessor(professor);
        course2.setScheduleInfo("Tue/Thu 2:00-4:00 PM");
        courseRepository.save(course2);

        Course course3 = new Course();
        course3.setCode("AI100");
        course3.setTitle("Higher Mathematics");
        course3.setDescription("Advanced Mathematical Concepts");
        course3.setSemester("Fall 2025");
        course3.setCapacity(20);
        course3.setAvailableSeats(20);
        course3.setProfessor(professor);
        course3.setScheduleInfo("Mon/Wed 1:00-3:00 PM");
        courseRepository.save(course3);

        System.out.println("Sample courses created and assigned to professor");
    }
}
