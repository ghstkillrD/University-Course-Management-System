# University Course Management System (UCMS)

A modern, full-stack web application for managing university courses, student enrollment, and academic records.

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Gradle** build tool

### Frontend
- **React 18** with **TypeScript**
- **Vite** build tool
- **Material-UI (MUI)** component library
- **React Router** for navigation
- **Axios** for API calls
- **React Context** for state management

## Features

### User Roles
- **Students**: Course registration, schedule viewing, grade checking
- **Professors**: Course management, roster viewing, grade submission
- **Administrators**: Full system management, user management, course creation

### Core Functionality
- User authentication and authorization (JWT-based)
- Course catalog browsing (public)
- Student course registration with conflict checking
- Grade management system
- Role-based dashboard views
- Responsive design for all devices

## Project Structure

```
UCMS/
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/ucms/
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST endpoints
│   │   ├── security/       # Security configuration
│   │   └── dto/           # Data transfer objects
│   ├── build.gradle       # Dependencies and build config
│   └── Dockerfile         # Container configuration
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── contexts/      # React context providers
│   │   └── App.tsx        # Main application component
│   └── package.json       # Dependencies and scripts
├── docker-compose.yml     # Multi-container setup
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
   cd D:\Projects\UCMS
   ```

2. **Configure environment variables:**
   
   Update `backend/.env.local`:
   ```env
   JWT_SECRET=your-very-secure-jwt-secret-key-change-this-in-production
   DATABASE_URL=jdbc:postgresql://localhost:5432/ucms
   DATABASE_USERNAME=ucms_user
   DATABASE_PASSWORD=ucms_password
   ```
   
   Update `frontend/.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

### Running with Docker (Recommended)

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
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

## Default Users

The system comes with sample users for testing:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin@ucms.edu | password | System administrator |
| Professor | prof.smith@ucms.edu | password | Sample professor |
| Student | john.doe@student.ucms.edu | password | Sample student |

**Note:** Change these credentials in production!## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Student registration
- `GET /api/auth/me` - Get current user info

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/semester/{semester}` - Get courses by semester

### Additional Features (To Be Implemented)
- Course enrollment management
- Grade submission and viewing
- User management (admin)
- Professor course management

## Development

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### Backend Development
```bash
cd backend
./gradlew bootRun          # Start development server
./gradlew test             # Run tests
./gradlew build            # Build for production
```

### Database Management
The application uses Hibernate's `ddl-auto=update` setting, so database schema will be automatically created and updated.

For production, consider using database migrations with Flyway or Liquibase.

## Deployment

### Render Deployment (Recommended)

1. **Backend (Spring Boot):**
   - Connect GitHub repository to Render
   - Set environment variables in Render dashboard
   - Deploy as a Web Service

2. **Frontend (React):**
   - Deploy as a Static Site
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Database:**
   - Use Render PostgreSQL add-on
   - Update connection string in backend environment

## Security Considerations

- JWT tokens expire after 24 hours
- Passwords are hashed using BCrypt
- CORS is configured for specific origins
- API endpoints are protected with role-based authorization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.