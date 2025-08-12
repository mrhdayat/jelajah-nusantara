# Deployment Guide - Jelajah Nusantara AI

## Overview

Panduan ini menjelaskan cara deploy aplikasi Jelajah Nusantara AI ke berbagai environment.

## Prerequisites

- Docker dan Docker Compose
- Node.js 18+ (untuk development)
- Python 3.11+ (untuk development)
- PostgreSQL 14+ (untuk production)
- Redis 6+ (untuk caching)

## Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jelajah_nusantara
REDIS_URL=redis://localhost:6379

# AI Services
IBM_WATSONX_API_KEY=your_watsonx_api_key
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_PROJECT_ID=your_project_id

OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application
SECRET_KEY=your_secret_key_here
DEBUG=false
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_APP_NAME=Jelajah Nusantara AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/jelajahnusantara/destination-ai.git
cd destination-ai
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python scripts/init_db.py

# Run development server
uvicorn main:app --reload --port 8000
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Docker Deployment

### 1. Using Docker Compose (Recommended)

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit environment files with your configuration

# Build and start services
docker-compose up -d

# Initialize database
docker-compose exec backend python scripts/init_db.py

# View logs
docker-compose logs -f
```

### 2. Individual Docker Containers

#### Backend

```bash
cd backend

# Build image
docker build -t jelajah-nusantara-backend .

# Run container
docker run -d \
  --name jelajah-backend \
  -p 8000:8000 \
  --env-file .env \
  jelajah-nusantara-backend
```

#### Frontend

```bash
cd frontend

# Build image
docker build -t jelajah-nusantara-frontend .

# Run container
docker run -d \
  --name jelajah-frontend \
  -p 3000:3000 \
  --env-file .env.local \
  jelajah-nusantara-frontend
```

## Production Deployment

### 1. Cloud Platforms

#### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Railway (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

#### Google Cloud Platform

```yaml
# app.yaml for App Engine
runtime: python311

env_variables:
  DATABASE_URL: postgresql://...
  IBM_WATSONX_API_KEY: ...
  
automatic_scaling:
  min_instances: 1
  max_instances: 10
```

#### AWS (using ECS)

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    image: your-registry/jelajah-backend:latest
    environment:
      - DATABASE_URL=postgresql://...
    ports:
      - "8000:8000"
  
  frontend:
    image: your-registry/jelajah-frontend:latest
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    ports:
      - "3000:3000"
```

### 2. Database Setup

#### PostgreSQL on Cloud

```sql
-- Create database
CREATE DATABASE jelajah_nusantara;

-- Create user
CREATE USER jelajah_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE jelajah_nusantara TO jelajah_user;
```

#### Supabase Setup

1. Create project on https://supabase.com
2. Get connection string from Settings > Database
3. Update DATABASE_URL in environment variables

### 3. Redis Setup

#### Redis Cloud

1. Create account on https://redis.com
2. Create database
3. Get connection string
4. Update REDIS_URL in environment variables

### 4. Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/jelajah-nusantara
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL Certificate

### Using Certbot (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### 1. Application Monitoring

```python
# backend/app/core/monitoring.py
import logging
from prometheus_client import Counter, Histogram

# Metrics
REQUEST_COUNT = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('request_duration_seconds', 'Request duration')

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### 2. Health Checks

```bash
# Backend health check
curl http://localhost:8000/health

# Frontend health check
curl http://localhost:3000/api/health
```

### 3. Log Aggregation

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Backup and Recovery

### 1. Database Backup

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_20240115_120000.sql
```

### 2. Automated Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL | gzip > /backups/backup_$DATE.sql.gz

# Keep only last 7 days
find /backups -name "backup_*.sql.gz" -mtime +7 -delete
```

## Security Considerations

### 1. Environment Variables

- Never commit .env files to version control
- Use secrets management in production
- Rotate API keys regularly

### 2. Database Security

- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular security updates

### 3. API Security

- Implement rate limiting
- Use HTTPS in production
- Validate all inputs
- Monitor for suspicious activity

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   pg_isready -h localhost -p 5432
   
   # Check connection string
   echo $DATABASE_URL
   ```

2. **AI Service Unavailable**
   ```bash
   # Check API keys
   echo $IBM_WATSONX_API_KEY
   
   # Test API connection
   curl -H "Authorization: Bearer $IBM_WATSONX_API_KEY" $IBM_WATSONX_URL
   ```

3. **Frontend Build Errors**
   ```bash
   # Clear cache
   npm run clean
   rm -rf .next
   
   # Rebuild
   npm run build
   ```

### Performance Optimization

1. **Database Optimization**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Implement query caching

2. **Frontend Optimization**
   - Enable image optimization
   - Use CDN for static assets
   - Implement code splitting

3. **Backend Optimization**
   - Use async/await for I/O operations
   - Implement response caching
   - Optimize AI model calls

## Support

For deployment issues:
- Check logs: `docker-compose logs`
- Review configuration
- Contact support: devops@jelajahnusantara.ai
