#!/bin/bash

# Production Deployment Script for UCMS
echo "🚀 Starting UCMS Production Deployment..."

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "❌ Error: .env.prod file not found!"
    echo "Please copy .env.example to .env.prod and configure your production values."
    exit 1
fi

# Load environment variables
set -a
source .env.prod
set +a

# Validate required environment variables
required_vars=("DATABASE_PASSWORD" "JWT_SECRET" "CORS_ALLOWED_ORIGINS")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set in .env.prod"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and start production services
echo "🔨 Building production images..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
if docker-compose -f docker-compose.prod.yml ps | grep -q "healthy"; then
    echo "✅ Services are healthy!"
    echo "🎉 UCMS is now running in production mode!"
    echo ""
    echo "📍 Access your application:"
    echo "   Backend API: http://localhost:8080/api"
    echo "   Database: localhost:5432"
    echo ""
    echo "📊 Monitor with:"
    echo "   docker-compose -f docker-compose.prod.yml logs -f"
else
    echo "❌ Some services may not be healthy. Check logs:"
    docker-compose -f docker-compose.prod.yml logs
fi
