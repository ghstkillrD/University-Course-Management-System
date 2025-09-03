# 🚀 UCMS Deployment Guide

## Quick Deployment Options

### Option 1: Local Production Test
```bash
# 1. Create production environment file
cp .env.example .env.prod

# 2. Edit .env.prod with your production values
# DATABASE_PASSWORD=your_secure_password
# JWT_SECRET=your_super_secure_jwt_secret_256_bits_long
# CORS_ALLOWED_ORIGINS=https://your-domain.com

# 3. Deploy locally
./deploy-prod.sh        # Linux/Mac
deploy-prod.bat         # Windows
```

### Option 2: Cloud Deployment (Recommended)

#### 🚅 Railway (Easiest)
1. Fork the repository
2. Connect to Railway: https://railway.app
3. Deploy backend: Select Spring Boot template
4. Deploy frontend: Select Static Site template
5. Add PostgreSQL database
6. Set environment variables

#### 🎨 Render
1. Connect GitHub repository
2. Create PostgreSQL database
3. Deploy backend as Web Service
4. Deploy frontend as Static Site
5. Configure environment variables

#### 📦 DigitalOcean App Platform
1. Create new app from GitHub
2. Use provided `.do/app.yaml` configuration
3. Add PostgreSQL database
4. Deploy with one click

### Option 3: Docker Production
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d

# Monitor
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Database
DATABASE_URL=jdbc:postgresql://host:5432/ucms
DATABASE_USERNAME=ucms_user
DATABASE_PASSWORD=secure_password

# Security
JWT_SECRET=your_super_secure_jwt_secret_256_bits_long
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Frontend Environment Variables
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 🔐 Security Checklist

- [ ] Change default JWT secret (256+ bits)
- [ ] Update default user passwords
- [ ] Configure HTTPS (automatic on most cloud platforms)
- [ ] Set proper CORS origins
- [ ] Enable database connection encryption
- [ ] Review security headers in production properties

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/auth/health`
- Database: Connection pooling with HikariCP
- Frontend: Static file serving

### Logging
- Production logs: INFO level
- Health check endpoint for uptime monitoring
- Database query optimization enabled

## 🎯 Quick Start Commands

### Local Development
```bash
./start-dev.sh          # Start development environment
```

### Production Deployment
```bash
./deploy-prod.sh        # Deploy production locally
```

### Cloud Deployment
1. Choose your platform (Railway, Render, DigitalOcean)
2. Follow platform-specific guide in DEPLOYMENT.md
3. Set environment variables
4. Deploy!

## 🆘 Troubleshooting

### Common Issues
1. **Database connection failed**: Check DATABASE_URL format
2. **CORS errors**: Verify CORS_ALLOWED_ORIGINS includes your domain
3. **JWT errors**: Ensure JWT_SECRET is set and secure
4. **404 on API calls**: Remember the /api context path

### Getting Help
- Check application logs
- Verify environment variables
- Test health endpoint: `/api/auth/health`
- Review DEPLOYMENT.md for platform-specific issues

## 🎉 You're Ready to Deploy!

Choose your deployment method and follow the steps above. Your UCMS application will be live in minutes! 🚀
