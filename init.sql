-- Sample data for testing
INSERT INTO users (username, password_hash, role) VALUES 
('admin@ucms.edu', '$2a$10$dXJ3SW6G7P6g4jxkLU8qxeZ2G4z8J8z8J8z8J8z8J8z8J8z8J8z8J8', 'ADMIN'),
('prof.smith@ucms.edu', '$2a$10$dXJ3SW6G7P6g4jxkLU8qxeZ2G4z8J8z8J8z8J8z8J8z8J8z8J8z8J8', 'PROFESSOR'),
('john.doe@student.ucms.edu', '$2a$10$dXJ3SW6G7P6g4jxkLU8qxeZ2G4z8J8z8J8z8J8z8J8z8J8z8J8z8J8', 'STUDENT');

INSERT INTO professors (id, employee_id, name, email, department) VALUES 
(1, 'EMP001', 'Administrator', 'admin@ucms.edu', 'Administration'),
(2, 'EMP002', 'Dr. John Smith', 'prof.smith@ucms.edu', 'Computer Science');

INSERT INTO students (id, student_id, name, email, date_of_birth) VALUES 
(3, 'STU001', 'John Doe', 'john.doe@student.ucms.edu', '2000-01-15');

INSERT INTO courses (code, title, description, semester, schedule_info, capacity, available_seats, professor_id) VALUES 
('CS101', 'Introduction to Computer Science', 'Basic concepts of programming and computer science', 'Fall 2025', 'MWF 9:00-10:00 AM', 30, 25, 2),
('CS201', 'Data Structures and Algorithms', 'Advanced programming concepts and algorithmic thinking', 'Fall 2025', 'TTH 11:00-12:30 PM', 25, 20, 2),
('MATH101', 'Calculus I', 'Introduction to differential calculus', 'Fall 2025', 'MTWF 10:00-11:00 AM', 40, 35, NULL);