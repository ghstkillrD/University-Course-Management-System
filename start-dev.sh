#!/bin/bash

# UCMS Development Startup Script
echo "Starting University Course Management System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start the database
echo "Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Start the backend
echo "Starting Spring Boot backend..."
cd backend
./gradlew bootRun &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 15

# Start the frontend
echo "Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🚀 UCMS is starting up!"
echo "📊 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080/api"
echo "🗄️  Database: localhost:5432"
echo ""
echo "To stop all services, press Ctrl+C"

# Wait for user to stop
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit" INT
wait