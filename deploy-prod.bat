@echo off
REM Production Deployment Script for UCMS (Windows)
echo 🚀 Starting UCMS Production Deployment...

REM Check if .env.prod exists
if not exist .env.prod (
    echo ❌ Error: .env.prod file not found!
    echo Please copy .env.example to .env.prod and configure your production values.
    pause
    exit /b 1
)

echo ✅ Environment file found

REM Build and start production services
echo 🔨 Building production images...
docker-compose -f docker-compose.prod.yml build

echo 🚀 Starting production services...
docker-compose -f docker-compose.prod.yml up -d

REM Wait for services
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak > nul

echo ✅ Production deployment initiated!
echo.
echo 📍 Access your application:
echo    Backend API: http://localhost:8080/api
echo    Database: localhost:5432
echo.
echo 📊 Monitor with:
echo    docker-compose -f docker-compose.prod.yml logs -f
echo.
pause
