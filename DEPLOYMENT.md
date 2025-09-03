# Cloud Deployment Configurations for UCMS

## 1. Railway Deployment

### Backend (Spring Boot)
```toml
# railway.toml
[build]
builder = "dockerfile"
dockerfilePath = "backend/Dockerfile.prod"

[deploy]
healthcheckPath = "/api/auth/health"
healthcheckTimeout = 300
restartPolicyType = "always"

[env]
DATABASE_URL = "${{DATABASE_URL}}"
JWT_SECRET = "${{JWT_SECRET}}"
CORS_ALLOWED_ORIGINS = "${{RAILWAY_STATIC_URL}}"
```

### Frontend (Static Site)
```toml
# frontend/railway.toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"
startCommand = "npm run preview -- --host 0.0.0.0 --port $PORT"

[env]
VITE_API_BASE_URL = "${{BACKEND_URL}}/api"
```

## 2. Render Deployment

### render.yaml
```yaml
services:
  - type: web
    name: ucms-backend
    env: java
    plan: starter
    buildCommand: "./gradlew build -x test"
    startCommand: "java -jar build/libs/*.jar"
    healthCheckPath: "/api/auth/health"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: ucms-postgres
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ALLOWED_ORIGINS
        value: "https://ucms-frontend.onrender.com"

  - type: web
    name: ucms-frontend
    env: static
    buildCommand: "npm run build"
    staticPublishPath: "./dist"
    pullRequestPreviewsEnabled: false
    envVars:
      - key: VITE_API_BASE_URL
        value: "https://ucms-backend.onrender.com/api"

databases:
  - name: ucms-postgres
    plan: starter
```

## 3. Heroku Deployment

### Procfile (backend)
```
web: java -jar build/libs/*.jar
```

### app.json
```json
{
  "name": "UCMS Backend",
  "description": "University Course Management System",
  "repository": "https://github.com/yourusername/ucms",
  "keywords": ["java", "spring-boot", "postgresql"],
  "addons": [
    {
      "plan": "heroku-postgresql:mini",
      "as": "DATABASE"
    }
  ],
  "env": {
    "JWT_SECRET": {
      "description": "Secret key for JWT token signing",
      "generator": "secret"
    },
    "CORS_ALLOWED_ORIGINS": {
      "description": "Allowed CORS origins",
      "value": "https://your-frontend-domain.herokuapp.com"
    }
  }
}
```

## 4. DigitalOcean App Platform

### .do/app.yaml
```yaml
name: ucms
services:
- name: backend
  source_dir: backend
  github:
    repo: yourusername/ucms
    branch: main
  run_command: java -jar build/libs/*.jar
  environment_slug: java
  instance_count: 1
  instance_size_slug: basic-xxs
  health_check:
    http_path: /api/auth/health
  envs:
  - key: DATABASE_URL
    scope: RUN_TIME
    value: ${ucms-postgres.DATABASE_URL}
  - key: JWT_SECRET
    scope: RUN_TIME
    type: SECRET
  - key: CORS_ALLOWED_ORIGINS
    scope: RUN_TIME
    value: ${APP_URL}

- name: frontend
  source_dir: frontend
  github:
    repo: yourusername/ucms
    branch: main
  build_command: npm run build
  run_command: npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_API_BASE_URL
    scope: BUILD_TIME
    value: ${backend.PUBLIC_URL}/api

databases:
- engine: PG
  name: ucms-postgres
  num_nodes: 1
  size: db-s-dev-database
  version: "15"
```

## 5. AWS ECS Deployment

### task-definition.json
```json
{
  "family": "ucms-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ucms-backend",
      "image": "your-ecr-repo/ucms-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "your-rds-connection-string"
        },
        {
          "name": "JWT_SECRET",
          "value": "your-jwt-secret"
        }
      ],
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:8080/api/auth/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ucms-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Environment Variables for All Platforms

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string (256+ bits)
- `CORS_ALLOWED_ORIGINS`: Your frontend domain(s)

### Optional Variables
- `JWT_EXPIRATION`: Token expiration time (default: 86400000)
- `DATABASE_USERNAME`: Database username (if not in URL)
- `DATABASE_PASSWORD`: Database password (if not in URL)

## Pre-deployment Checklist

1. ✅ Update JWT_SECRET to a secure random value
2. ✅ Configure CORS_ALLOWED_ORIGINS with your domain
3. ✅ Set up PostgreSQL database
4. ✅ Test health endpoint: `/api/auth/health`
5. ✅ Verify all environment variables
6. ✅ Test with production configuration locally
7. ✅ Set up monitoring and logging
8. ✅ Configure HTTPS (usually automatic on cloud platforms)
