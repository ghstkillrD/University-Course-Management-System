# University Course Management System (UCMS)

A modern, full-stack web application for managing university courses, student enrollment, and academic records with comprehensive role-based access control.

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security 6.x** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Gradle** build tool
- **Docker** containerization

### Frontend
- **React 18** with **TypeScript**
- **Vite** build tool
- **Material-UI (MUI)** component library
- **React Router v6** for navigation
- **Axios** for API calls
- **React Context** for state management

## Features

### User Roles & Capabilities
- **Students**: Course registration, schedule viewing, transcript access, enrollment management
- **Professors**: Course management, student roster viewing, course statistics, enrollment oversight
- **Administrators**: Full system management, user management, course creation, system statistics

### Core Functionality
- ✅ JWT-based authentication and authorization
- ✅ Course catalog browsing (public access)
- ✅ Student course registration with conflict checking
- ✅ Role-based dashboard views with real-time data
- ✅ Professor course management and statistics
- ✅ Student enrollment tracking and management
- ✅ Comprehensive security configuration
- ✅ Docker containerization for easy deployment
- ✅ Responsive design for all devices
- ✅ Auto-populated test data for development

### Security Features
- JWT token validation with 24-hour expiration
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS configuration for cross-origin requests
- Spring Security 6.x with explicit SecurityContext management
- Protected API endpoints with method-level security

## Project Structure

```
UCMS/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/ucms/
│   │   ├── entity/         # JPA entities (User, Student, Professor, Course, Enrollment)
│   │   ├── repository/     # Data access layer with Spring Data JPA
│   │   ├── service/        # Business logic (Auth, Student, Professor, Course services)
│   │   ├── controller/     # REST endpoints (Auth, Professor, Course controllers)
│   │   ├── security/       # Security configuration & JWT handling
│   │   └── dto/           # Data transfer objects
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration with JWT & database settings
│   ├── build.gradle       # Dependencies and build config
│   ├── Dockerfile         # Container configuration
│   └── DataLoader.java    # Auto-populates test data on startup
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components (Layout, ProtectedRoute)
│   │   ├── pages/         # Page components (Login, Dashboard, Course Catalog)
│   │   ├── services/      # API service layer (auth, course services)
│   │   ├── contexts/      # React context providers (AuthContext)
│   │   └── App.tsx        # Main application with routing
│   ├── package.json       # Dependencies and scripts
│   └── vite.config.ts     # Vite configuration
├── docker-compose.yml     # Multi-container setup (backend + postgres)
├── init.sql              # Database initialization
├── start-dev.bat         # Windows startup script
├── start-dev.sh          # Unix startup script
└── README.md             # This file
```## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Docker and Docker Compose (optional)
- PostgreSQL (if not using Docker)

### Environment Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd UCMS
   ```

2. **Configure environment variables:**
   
   The application uses default values that work with Docker. For custom setups, update:
   
   Backend configuration in `backend/src/main/resources/application.properties`:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/ucms
   spring.datasource.username=ucms_user
   spring.datasource.password=ucms_password
   
   # JWT Configuration  
   jwt.secret=mySecretKeyForUCMSApplicationThatIs256BitsLongAndVerySecure
   jwt.expiration=86400000
   
   # Server Configuration
   server.port=8080
   server.servlet.context-path=/api
   ```

### Quick Start with Docker (Recommended)

1. **Start all services:**
   ```bash
   # Using provided scripts
   ./start-dev.sh      # On Unix/Linux/Mac
   start-dev.bat       # On Windows
   
   # Or manually with docker-compose
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432 (ucms_user/ucms_password)

3. **View logs:**
   ```bash
   docker-compose logs backend   # Backend logs
   docker-compose logs postgres  # Database logs
   ```
   - Database: localhost:5432

### Running Locally (Development)

#### Backend
```bash
cd backend
./gradlew bootRun
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Database
Set up PostgreSQL locally or use Docker:
```bash
docker run --name ucms-postgres -e POSTGRES_DB=ucms -e POSTGRES_USER=ucms_user -e POSTGRES_PASSWORD=ucms_password -p 5432:5432 -d postgres:15
```

## Default Test Users

The system automatically loads test data on first startup:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin | admin123 | System administrator with full access |
| Professor | professor | professor123 | Sample professor for course management |
| Student | student | student123 | Sample student for enrollment testing |

**Important Notes:**
- Test data is only loaded if the database is empty
- Change these credentials before production deployment
- All passwords are securely hashed using BCrypt

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /login` - User authentication (returns JWT token)
- `POST /register` - Student registration
- `GET /me` - Get current user information

### Courses (`/api/courses/`)
- `GET /` - Get all courses (public access)
- `GET /{id}` - Get course by ID
- `GET /semester/{semester}` - Get courses by semester
- `GET /professor/{professorId}` - Get courses by professor

### Professor Dashboard (`/api/professor/`)
- `GET /test` - Test endpoint (returns status)
- `GET /stats` - Get professor statistics (course count, student count)
- `GET /my-courses` - Get courses taught by current professor
- `GET /course/{courseId}/roster` - Get student roster for specific course
- `PUT /course/{courseId}` - Update course details

### Student Management (`/api/student/`)
- `GET /dashboard` - Student dashboard data
- `GET /schedule` - Current semester schedule
- `GET /transcript` - Academic transcript

### Enrollment Management (`/api/enrollments/`)
- `POST /enroll` - Enroll in a course
- `GET /my-schedule` - Get current schedule
- `GET /my-transcript` - Get transcript
- `GET /stats` - Get enrollment statistics
- `GET /course/{courseId}/details` - Get course enrollment details

## Development

### Backend Development
```bash
cd backend
./gradlew bootRun          # Start development server
./gradlew test             # Run tests
./gradlew build            # Build for production
./gradlew clean build      # Clean and rebuild
```

### Frontend Development
```bash
cd frontend
npm install                # Install dependencies
npm run dev               # Start development server (http://localhost:5173)
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Run ESLint
```

### Database Management
- **Auto-migration**: Uses Hibernate's `ddl-auto=update` for automatic schema updates
- **Test data**: Automatically loaded via `DataLoader.java` on first startup
- **Manual access**: Connect to PostgreSQL on `localhost:5432` with credentials `ucms_user/ucms_password`

For production, consider implementing proper database migrations with Flyway or Liquibase.

### Container Management
```bash
# View logs
docker-compose logs backend -f    # Follow backend logs
docker-compose logs postgres -f   # Follow database logs

# Restart services
docker-compose restart backend    # Restart only backend
docker-compose restart postgres   # Restart only database

# Stop services
docker-compose down              # Stop all services
docker-compose down -v           # Stop and remove volumes (clears database)
```

## Troubleshooting

### Common Issues

1. **403 Forbidden Errors**
   - Ensure JWT token is included in Authorization header
   - Check that user role matches endpoint requirements
   - Verify SecurityConfig path mappings

2. **404 Not Found on API Endpoints**
   - Remember the context path is `/api` 
   - All endpoints are prefixed with `/api`
   - Example: `/professor/test` becomes `/api/professor/test`

3. **Database Connection Issues**
   - Ensure PostgreSQL container is running: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`
   - Verify connection string in `application.properties`

4. **Frontend Build Issues**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 18+)
   - Verify Vite configuration

### Development Notes

- **JWT Secret**: Default secret is for development only - change for production
- **CORS**: Configured for common development ports (3000, 5173-5175)
- **Logging**: Debug logging enabled for security and web components
- **Hot Reload**: Frontend supports hot reload, backend requires restart for changes

## Deployment

## Deployment

### Docker Production Deployment

1. **Build production images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy with environment variables:**
   ```bash
   # Set production environment variables
   export JWT_SECRET="your-secure-production-jwt-secret-256-bits-long"
   export DATABASE_PASSWORD="secure-production-password" 
   export CORS_ALLOWED_ORIGINS="https://your-domain.com"
   
   # Start production services
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment (Render/Railway/Heroku)

1. **Backend (Spring Boot):**
   ```bash
   # Build command
   ./gradlew build
   
   # Start command  
   java -jar build/libs/ucms-backend-*.jar
   
   # Environment variables to set:
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-production-secret
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

2. **Frontend (Static Site):**
   ```bash
   # Build command
   npm run build
   
   # Publish directory: dist
   # Set VITE_API_BASE_URL to your backend URL
   ```

3. **Database:**
   - Use managed PostgreSQL service
   - Import initial schema from `init.sql`
   - Set connection string in backend environment

### Environment Variables for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `jdbc:postgresql://host:5432/ucms` |
| `DATABASE_USERNAME` | Database username | `ucms_user` |
| `DATABASE_PASSWORD` | Database password | `secure_password` |
| `JWT_SECRET` | JWT signing secret (256+ bits) | `your-super-secure-jwt-secret` |
| `JWT_EXPIRATION` | Token expiration (milliseconds) | `86400000` (24 hours) |
| `CORS_ALLOWED_ORIGINS` | Frontend domains | `https://yourdomain.com` |

## Security Considerations

### Authentication & Authorization
- **JWT Tokens**: 24-hour expiration with secure signing
- **Password Security**: BCrypt hashing with salt rounds
- **Role-Based Access**: Method-level security with `@PreAuthorize` annotations
- **CORS Protection**: Configured for specific origins only
- **SecurityContext**: Explicit save configuration for Spring Security 6.x

### API Security
- Protected endpoints require valid JWT tokens
- Public endpoints: course catalog, authentication
- Professor endpoints: course management, statistics
- Student endpoints: enrollment, schedule, transcript
- Admin endpoints: user management, system administration

### Production Security Checklist
- [ ] Change default JWT secret to 256+ bit random string
- [ ] Update default user passwords
- [ ] Configure HTTPS in production
- [ ] Set secure CORS origins
- [ ] Enable database connection encryption
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Configure proper logging and monitoring

## Project Status

### ✅ Completed Features
- User authentication with JWT tokens
- Role-based access control (Student, Professor, Admin)
- Student dashboard with enrollment statistics
- Professor dashboard with course management
- Course catalog (public access)
- Student enrollment system
- Docker containerization
- Comprehensive security configuration
- Auto-populated test data
- Cross-origin resource sharing (CORS)
- Spring Security 6.x integration

### 🚧 In Progress
- Course enrollment conflict detection
- Grade management system
- Enhanced error handling and validation

### 📋 Planned Features
- Email notifications for enrollment
- Course prerequisites management
- Academic calendar integration
- Report generation (transcripts, rosters)
- Advanced search and filtering
- Mobile app support
- Integration testing suite

## Contributing

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes with proper commit messages**
4. **Add tests for new functionality**
5. **Ensure all tests pass:**
   ```bash
   ./gradlew test  # Backend tests
   npm test        # Frontend tests
   ```
6. **Submit a pull request with detailed description**

### Code Style Guidelines
- **Backend**: Follow Spring Boot conventions and Google Java Style
- **Frontend**: Use Prettier and ESLint configurations
- **Database**: Use descriptive names and proper normalization
- **Git**: Use conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions:
- Create an issue in the GitHub repository
- Follow the project documentation
- Check troubleshooting section for common problems

---

**Built with ❤️ using Spring Boot, React, and Docker**