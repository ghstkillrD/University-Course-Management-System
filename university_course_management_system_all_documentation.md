# University Course Management System

## 1. Project Overview

**Project Title:** Modern University Course Management System

**Project Description:**
A full-stack, modern web application designed to digitize and streamline the core academic processes of a university. The system provides a secure, role-based portal for students, professors, and administrators to manage course offerings, registrations, and academic records, replacing traditional legacy systems with a contemporary, scalable tech stack.

**Primary Objectives:**
*   To provide students with an intuitive interface to browse available courses, manage their registration, and view their academic transcript.
*   To empower professors by giving them tools to manage their course content and efficiently submit grades.
*   To enable administrators to oversee the entire system, manage the course catalog, and handle user accounts.
*   To demonstrate proficiency in modern enterprise development practices by using a current tech stack devoid of legacy Java EE components.

**Target Users:**
*   **Students:** Can register for courses, view their schedules, and check grades.
*   **Professors:** Can view course rosters and submit grades for their assigned courses.
*   **Administrators:** Have full system control to manage courses, users, and academic data.

**Core Features & Functionality:**
*   **User Authentication & Authorization:** Secure login and role-based access control (JWT).
*   **Course Management:** CRUD operations for courses (Admins) and limited editing (Professors).
*   **Course Catalog:** A searchable, filterable list of available courses for the semester.
*   **Student Registration:** Allows students to enroll in or drop courses with built-in conflict checks.
*   **Grade Management:** Professors can submit grades; students and admins can view them.
*   **User Management:** Administrators can create and manage all user accounts.

**Key Deliverables:**
1.  Fully functional and deployed web application.
2.  Complete, well-documented source code in a GitHub repository.
3.  Detailed project report documenting the design, implementation, and challenges.
4.  Deployment and setup instructions for local development.

**Overall Impact:**
This project serves as a comprehensive demonstration of modern full-stack development skills. It highlights the ability to design, build, secure, and deploy a scalable enterprise application using industry-standard technologies and best practices, directly preparing students for real-world software development roles.

## 2. System Architecture

### High-Level Overview
```sql
  +-------------------------------------------------------------------+
  |                        Client Tier (Frontend)                     |
  |                                                                   |
  |    [React.js SPA]                                                 |
  |    (Hosted on Render)                                             |
  |    - Built with Vite + TypeScript                                 |
  |    - Styled with Material-UI (MUI)                                |
  |    - State managed by React Context                               |
  |    - Routes handled by React Router                               |
  +------------------------------------------|------------------------+
                                             | HTTPS (REST API Calls)
                                             | (JSON)
                                             |
  +------------------------------------------|------------------------+
  |                        Server Tier (Backend)                      |
  |                                                                   |
  |    [Spring Boot Application]                                       |
  |    (Hosted on Render)                                             |
  |    - Java 17                                                      |
  |    - Spring Web (REST Controllers)                                |
  |    - Spring Data JPA / Hibernate (ORM)                            |
  |    - Spring Security + JWT (Auth)                                 |
  |    - Gradle (Build)                                               |
  +------------------------------------------|------------------------+
                                             | JDBC
                                             |
  +------------------------------------------|------------------------+
  |                        Data Tier                                  |
  |                                                                   |
  |    [PostgreSQL Database]                                          |
  |    (Hosted on Render PostgreSQL or external cloud DB)             |
  |    - Stores: Users, Students, Professors, Courses, Enrollments    |
  +-------------------------------------------------------------------+
  ```
  
### Detailed Component Architecture
**1. Client Tier (Frontend - React Application on Render):**
*   **Components:** Reusable UI components (e.g., `Navbar`, `CourseCard`, `GradeForm`).
*   **Pages:** Top-level components representing routes (e.g., `LoginPage`, `DashboardPage`, `CourseCatalogPage`).
*   **Services:** Modules (e.g., `api.js` or `authService.ts`) that use **Axios** to make HTTP requests to the backend API. These handle attaching the JWT token to requests.
*   **Context:** **React Context** providers for managing global application state (e.g., `AuthContext` for user data and login status).
*   **Build:** The **Vite** build tool compiles the TypeScript and React code into static HTML, CSS, and JavaScript files, which are served by **Render's** static site hosting.

**2. Server Tier (Backend - Spring Boot Application on Render):**
This is a layered architecture within the Spring Boot application:
*   **Controller Layer (REST Controllers):**
    *   Receives HTTP requests from the frontend.
    *   Maps JSON payloads to Java objects.
    *   Performs basic validation and authentication checks via Spring Security filters.
    *   Delegates business logic to the Service layer.
    *   Returns HTTP responses (JSON data or status codes).
*   **Service Layer (Business Logic):**
    *   Contains the core business rules (e.g., checking for course conflicts before enrollment, calculating GPA).
    *   Orchestrates transactions and calls the Persistence layer.
    *   Where method-level security (`@PreAuthorize`) is enforced.
*   **Persistence Layer (Repository):**
    *   Interfaces (`JpaRepository`) provided by **Spring Data JPA**.
    *   Translates Java method calls into SQL queries executed by **Hibernate**.
    *   Handles all CRUD operations against the **PostgreSQL** database.
*   **Security Layer:**
    *   **JWT Filter:** A custom filter that intercepts requests, validates JWT tokens, and sets up the security context.
    *   **Spring Security Config:** Configures authentication rules, password encoding, and URL-based authorization.
*   **Entity Layer (Model):**
    *   Plain Old Java Objects (POJOs) annotated with `@Entity` that map directly to database tables.

**3. Data Tier (PostgreSQL Database on Render):**
*   Hosted as a **Render PostgreSQL** add-on or another cloud-provided database service.
*   Stores all persistent data in tables based on the defined schema (`users`, `students`, `professors`, `courses`, `enrollments`).

### Deployment Architecture on Render
```jsx
[GitHub Repository]
       |
       | (Git Push triggers deployment)
       |
       |            +----------------------------+
       +----------->| Render Platform            |
                    |                            |
                    |  +---------------------+   |
                    |  | Backend Service     |   |   +---------------+
                    |  | (Spring Boot JAR)   |<----->| PostgreSQL DB|
                    |  |                     |   |   | (Render Add-on)|
                    |  +---------------------+   |   +---------------+
                    |            ^               |
                    |  +---------------------+   |
                    |  | Frontend Service    |   |
                    |  | (Static Site)       |   |
                    |  |                     |   |
                    |  +---------------------+   |
                    +----------------------------+
                            ^
                            |
                    [User's Browser]
                            |
                    +-----------------+
                    | React SPA       |
                    | (Loaded from    |
                    |  Render CDN)    |
                    +-----------------+
```

## 3. Tech Stack

### Backend (Server-Side)
*   **Core Framework:** Spring Boot 3.x
*   **Language:** Java 17
*   **Build Tool:** Gradle
*   **Persistence:** Spring Data JPA with Hibernate
*   **Database:** PostgreSQL
*   **API Style:** RESTful JSON APIs
*   **Security:** Spring Security with JWT
*   **Validation:** Bean Validation 3.0 (Jakarta Validation)

### Frontend (Client-Side)
*   **Framework:** React.js 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **HTTP Client:** Axios
*   **State Management:** React Context API + useReducer Hook
*   **UI Component Library:** Material-UI (MUI)
*   **Routing:** React Router

### Development & Deployment
*   **Version Control:** Git with GitHub
*   **API Testing:** Postman
*   **Containerization:** Docker
*   **Local Database:** Docker Compose
*   **Deployment (Backend):** Render
*   **Deployment (Frontend):** Render
*   **CI/CD (Optional):** GitHub Actions

## 4. User Flows

### A. Public / Guest User Flow:
1.  **Landing Page:** Views the application homepage.
2.  **Browse Course Catalog:** Views a read-only list of all courses with basic info (Code, Title, Description, Professor Name).
3.  **End Flow:** Promoted to **Login** or **Register** as a student.

### B. Student User Flow (After Login):
1.  **Student Dashboard:** Views personal dashboard after login.
2.  **View Profile:** Sees their own details.
3.  **Course Registration:**
    *   Browses the available course catalog for the current semester.
    *   Uses filters (semester, department).
    *   Clicks "Register" on a course.
    *   **Success:** Course added to schedule, seat count decremented.
    *   **Error:** Handles conflicts, pre-requisites, full capacity.
4.  **View My Schedule:** Sees a list or calendar view of registered courses.
5.  **Drop a Course:** Drops a course, freeing up a seat.
6.  **View Transcript:** Views grades for all completed courses.
7.  **Logout.**

### C. Professor User Flow (After Login):
1.  **Professor Dashboard:** Upon login, sees a dashboard tailored to them.
    *   Overview: A list of the courses they are assigned to teach in the current and upcoming semesters.
    *   Key actions: "View Roster", "Enter Grades".
2.  **View My Courses:** Selects a specific course they teach to manage it.
3.  **Manage Course Content (Limited CRU*):**
    *   **View:** Sees all details of the course.
    *   **Update:** Can edit **only** the fields they are permitted to (e.g., `description`, `syllabus_text`, `schedule_info`). They **cannot** change the course `code`, `title`, or `capacity`.
4.  **View Course Roster:**
    *   Clicks "View Roster" for a course.
    *   Sees a list of all students enrolled in that specific course (Name, Student ID, Email).
    *   This list is read-only; they cannot add or remove students.
5.  **Manage Grades:**
    *   From the roster view, clicks "Enter Grades".
    *   Sees a list of enrolled students with an input field or dropdown next to each for assigning a grade (`A`, `B+`, `C`, etc.).
    *   Submits the grades. The system updates the `grade` field in the respective `Enrollment` record.
    *   **Scope:** Can only grade students in their assigned courses.
6.  **Logout.**

### D. Administrator User Flow (After Login):
1.  **Admin Dashboard:** Sees a system management console upon login.
    *   Overview: System statistics (total courses, users, etc.).
    *   Quick links: "Manage Courses", "Manage Users", "Manage Professors".
2.  **Manage Courses (Full CRUD):**
    *   **Create Course:** Fills a form to create a new course offering. **Assigns a Professor** from a list of existing professors.
    *   **View/Edit All Courses:** Can see and edit **every field** of **any** course.
    *   **Delete/Archive Course:** Removes a course offering from the system.
3.  **Manage Students:**
    *   Views a list of all student accounts.
    *   Can create new student accounts (or simulate a registration process).
    *   Can view a student's full profile, course history, and transcript.
    *   Can deactivate accounts.
4.  **Manage Professors & Admins:**
    *   Views a list of all faculty (Professors and other Admins).
    *   **Creates Professor/Admin accounts.** This is crucial.
    *   Assigns the `PROFESSOR` or `ADMIN` role to users.
5.  **System Overrides:**
    *   Can manually register a student for a course (e.g., to override a full capacity error).
    *   Can force-drop a student from a course.
    *   Can edit any grade in the system.
6.  **Logout.**

## 5. Database Schema
```sql
-- CENTRAL AUTHENTICATION TABLE
CREATE TABLE User (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL, -- Often email
    password_hash VARCHAR(255) NOT NULL,   -- Hashed password
    role ENUM('STUDENT', 'PROFESSOR', 'ADMIN') NOT NULL
);

-- STUDENT PROFILE (extends User)
CREATE TABLE Student (
    id BIGINT PRIMARY KEY, -- Same ID as in User table (1-to-1 relationship)
    student_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_of_birth DATE,
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
);

-- PROFESSOR PROFILE (extends User)
CREATE TABLE Professor (
    id BIGINT PRIMARY KEY, -- Same ID as in User table (1-to-1 relationship)
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100),
    FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
);

-- COURSE CATALOG
CREATE TABLE Course (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    semester VARCHAR(50) NOT NULL,
    schedule_info VARCHAR(255),
    capacity INT DEFAULT 30,
    available_seats INT DEFAULT 30,
    professor_id BIGINT NULL, -- Foreign key to Professor (id)
    FOREIGN KEY (professor_id) REFERENCES Professor(id) ON DELETE SET NULL
);

-- JUNCTION TABLE linking Students to Courses
CREATE TABLE Enrollment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(5) NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);
```
### How Authentication Works with This Schema:

1.  **Login:** A person logs in using credentials from the `User` table (`username`, `password`).
2.  **Role Check:** Upon successful login, the system checks their `role`.
3.  **Profile Fetch:** Based on the role, the system fetches their profile details:
    *   If `role = 'STUDENT'`, it gets details from the `Student` table where `Student.id = User.id`.
    *   If `role = 'PROFESSOR'` or `'ADMIN'`, it gets details from the `Professor` table where `Professor.id = User.id`.
4.  **Access Control:** This complete user object (with role and profile data) is then used to control what is shown in the UI and what API endpoints they can access on the backend.

## 6. Authentication & Authorization Flow

### Phase 0: Preparation (User Registration & Account Setup)
*   **Student Registration:** A public user fills a form (name, email, password, etc.). The React app sends a `POST /api/auth/register/student` request.
*   **Backend Process:**
    1.  Spring Boot receives the request, validates the data.
    2.  It hashes the password (using BCrypt) and creates a new record in the `User` table with `role = 'STUDENT'`.
    3.  It then creates a corresponding profile record in the `Student` table, linking it to the new `User` ID.
*   **Professor/Admin Creation:** This is **not** a public function. An existing **Administrator** uses the system's admin panel to create these accounts internally (`POST /api/admin/users`), assigning the appropriate role (`PROFESSOR` or `ADMIN`).

### Phase 1: Login (Authentication - AuthN)
**1. User Action:** A user enters their username (email) and password on the login page.
**2. Frontend (React) Action:** Sends a `POST` request to `/api/auth/login` with credentials.
**3. Backend (Spring Security) Process:**
    *   Request intercepted by `UsernamePasswordAuthenticationFilter`.
    *   Custom `UserDetailsService` loads user from DB (joining `User` and profile tables).
    *   Compares provided password with stored hash.
    *   If invalid, returns `401 Unauthorized`.
**4. On Success:** Backend generates a JWT containing claims (`username`, `role`, `profileId`) and sends it back in the response body.
**5. Frontend Storage:** React app stores the token (in memory/HttpOnly cookie) and updates global state.

### Phase 2: Accessing Protected Resources (Authorization - AuthZ)
**1. User Action:** User tries to access a protected feature.
**2. Frontend Action:** React adds JWT to `Authorization: Bearer <token>` header of API request.
**3. Backend Process - Security Chain:**
    *   **JWT Filter:** Intercepts request, validates token, creates `Authentication` object.
    *   **Controller Method:** Annotated with `@PreAuthorize` rules.
    *   **Example Rule:** `@PreAuthorize("hasRole('STUDENT') and #studentId == principal.profileId")`
    *   **Service Check:** Custom business rule checks (e.g., `@courseService.isTeachingCourse(...)`) enforce data-level security.
**4. Response:** If authorized, returns data (`200 OK`). If not, returns `403 Forbidden`.

### Phase 3: Logout
**1. User Action:** Clicks "Logout".
**2. Frontend Action:** Discards JWT token, clears application state, redirects to login.
**3. Backend Action:** Stateless (JWT discarded client-side). Optional token blacklist can be implemented.

## 7. API Endpoints

### Authentication API
| Endpoint | Method | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Authenticates a user and returns a JWT token. | Public |
| `/api/auth/register` | POST | Public endpoint for a new student to register. | Public |
| `/api/auth/me` | GET | Returns the currently logged-in user's details. | Any Authenticated User |

### Course API (Core Catalog)
| Endpoint | Method | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `/api/courses` | GET | Get all courses. | Public |
| `/api/courses/{id}` | GET | Get a specific course by its ID. | Public |
| `/api/courses` | POST | Create a new course. | `ADMIN` |
| `/api/courses/{id}` | PUT | Update a course's details (all fields). | `ADMIN` |
| `/api/courses/{id}` | PATCH | Partially update a course. | `ADMIN`, `PROFESSOR` (own course only) |
| `/api/courses/{id}` | DELETE | Delete/Archive a course. | `ADMIN` |
| `/api/courses/professor/{profId}` | GET | Get all courses taught by a specific professor. | `ADMIN`, `PROFESSOR` (own ID only) |
| `/api/courses/semester/{semester}` | GET | Get all courses for a specific semester. | Public |

### Enrollment API (Student Registration)
| Endpoint | Method | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `/api/enrollments` | POST | Register a student for a course. | `STUDENT` (own ID only), `ADMIN` |
| `/api/enrollments/{enrollmentId}` | DELETE | Drop a course (delete an enrollment). | `STUDENT` (own enrollment only), `ADMIN` |
| `/api/enrollments/course/{courseId}` | GET | Get the roster for a course. | `ADMIN`, `PROFESSOR` (teaching course only) |
| `/api/enrollments/student/{studentId}` | GET | Get a student's schedule. | `STUDENT` (own ID only), `ADMIN` |

### Grade API
| Endpoint | Method | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `/api/grades/course/{courseId}` | GET | Get all grades for a specific course. | `ADMIN`, `PROFESSOR` (teaching course only) |
| `/api/grades/student/{studentId}` | GET | Get a student's transcript. | `STUDENT` (own ID only), `ADMIN` |
| `/api/grades` | POST | Submit or update a grade. | `ADMIN`, `PROFESSOR` (if teaching the course) |
| `/api/grades/{enrollmentId}` | PUT | Override a grade. | `ADMIN` |

### User Management API (Admin Only)
| Endpoint | Method | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `/api/admin/users` | GET | Get all users (or filter by role). | `ADMIN` |
| `/api/admin/users` | POST | Create a new user (Professor or Admin). | `ADMIN` |
| `/api/admin/users/{userId}` | GET | Get a specific user's details. | `ADMIN` |
| `/api/admin/users/{userId}` | PUT | Update a user's details. | `ADMIN` |
| `/api/admin/professors` | GET | Get all professors. | `ADMIN` |
| `/api/admin/students` | GET | Get all students. | `ADMIN` |

### Implementation Notes:

**Path Variables:** `{id}`, `{studentId}`, `{courseId}`, `{profId}` are placeholders for actual database IDs.

**Authorization Logic:** The rules in the table are role-based. The detailed data-level security (e.g., a student can only access their own data) must be implemented inside the corresponding Service methods using the `@PreAuthorize` annotation and SpEL expressions, as described in the previous AuthZ flow.

*   **Example:** `@PreAuthorize("hasRole('STUDENT') and #studentId == principal.profileId")`

**Request & Response Bodies:** All `POST` and `PUT` requests will typically accept and return JSON data representing the resource (e.g., a Course object, an Enrollment object).

**Error Handling:** All endpoints must return appropriate HTTP status codes:
*   `200 OK` for successful GET requests.
*   `201 Created` for successful POST requests.
*   `400 Bad Request` for invalid client input.
*   `401 Unauthorized` if not logged in.
*   `403 Forbidden` if logged in but lacking permission.
*   `404 Not Found` if a resource doesn't exist.

**API Versioning:** For a real enterprise app, consider prefixing routes with `/api/v1/` for future version management.

## 8. UI/UX Styling Guidelines

### 1. Design Philosophy & Approach
*   **Theme:** "Professional Academic Dashboard." Clean, data-dense, and highly functional.
*   **Principle:** Clarity over decoration. Prioritize readability and ease of use for prolonged administrative and academic tasks.
*   **Experience:** Intuitive navigation, immediate feedback for user actions, and responsive design that works seamlessly on desktop.

### 2. Layout & Structure
*   **Framework:** Use the **Material-UI (MUI) `Grid`** and `Box` components for a structured, responsive layout.
*   **Navigation:** A **fixed, left-hand sidebar** (MUI `Drawer` component) for primary navigation.
    *   **Sidebar Items:** Dashboard, Course Catalog, My Courses (Student)/Manage Courses (Admin/Prof), Grades, Users (Admin), Profile.
*   **App Bar:** A top **App Bar** (MUI `AppBar`) containing the page title, user avatar, and notifications/logout.
*   **Main Content Area:** A responsive container with comfortable padding.

### 3. Color Palette (MUI Theme)
```jsx
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },    // blue-600
    secondary: { main: '#2d3748' },  // gray-700
    background: { default: '#f7fafc' }, // gray-100
    text: { primary: '#000000' },    // black
  },
});
```

### 4. Typography (MUI Scale)
*   **Font Family:** Default MUI stack (`Roboto`).
*   **Hierarchy:** Use MUI variants:
    *   `h4` (Page titles)
    *   `h5` (Section titles)
    *   `h6` (Card/Table headers)
    *   `subtitle1` (Labels)
    *   `body1` (Body text)
    *   `button` (Button text)

### 5. Component-Specific Styling
*   **Tables (MUI `DataGrid` or `Table`):**
    *   Enable sorting, filtering, pagination
    *   Use striped rows for readability
*   **Forms (MUI `TextField`):**
    *   Use **outlined** variants
    *   Display validation errors below the input field
*   **Buttons (MUI `Button`):**
    *   **Contained** (Primary)
    *   **Outlined** (Secondary)
    *   **Text** (Tertiary)
*   **Alerts & Feedback (MUI `Alert`, `Snackbar`):**
    *   Use Snackbars for notifications
    *   Success (Green)
    *   Info (Blue)
    *   Warning (Orange)
    *   Error (Red)

### 6. Interaction & Feedback
*   **Hover States:** Clear visual change for all clickable elements
*   **Loading States:** Buttons show MUI `CircularProgress` during processing
*   **Disabled States:** Reduced opacity to indicate unavailability

### 7. Imagery & Icons
*   **Icons:** Use **MUI Icons** library alongside text labels for clarity
*   **Data Visualization:** Use **Recharts** or **Victory** styled to match MUI theme

### 8. Responsiveness
*   Sidebar collapses on smaller screens
*   Tables scroll horizontally on mobile
*   Padding and font sizes adjust appropriately