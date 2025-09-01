@echo off
REM UCMS Development Startup Script for Windows
echo Starting University Course Management System...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    exit /b 1
)

REM Start the database
echo Starting PostgreSQL database...
docker-compose up -d postgres

REM Wait for database to be ready
echo Waiting for database to be ready...
timeout /t 10 >nul

REM Start the backend in a new window
echo Starting Spring Boot backend...
start "UCMS Backend" cmd /k "cd backend && gradlew.bat bootRun"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 15 >nul

REM Start the frontend in a new window
echo Starting React frontend...
start "UCMS Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo 🚀 UCMS is starting up!
echo 📊 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:8080/api
echo 🗄️  Database: localhost:5432
echo.
echo Backend and Frontend are running in separate windows.
echo To stop all services, close the terminal windows and run: docker-compose down
pause