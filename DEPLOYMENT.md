# Prompt Studio - Complete Deployment Guide

This guide covers deploying both the frontend and backend of Prompt Studio in various environments.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Development Environment](#development-environment)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

Prompt Studio consists of two main components:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Frontend (React + Vite)                    │
│              Port: 5173 (dev) / 80 (prod)               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│           Backend API (Fastify + Node.js)               │
│                    Port: 3001                           │
└─────────────┬────────────────────┬──────────────────────┘
              │                    │
              │                    │
┌─────────────▼──────┐  ┌─────────▼────────┐
│   PostgreSQL 16    │  │    Redis 7       │
│     Port: 5432     │  │   Port: 6379     │
└────────────────────┘  └──────────────────┘
```

## Development Environment

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+ (optional)
- Git

### Setup Steps

#### 1. Clone Repositories

```bash
# Clone both repositories (assuming they're in the same parent directory)
git clone <backend-repo-url> prompt-studio-api
git clone <frontend-repo-url> prompt-studio
```

#### 2. Backend Setup

```bash
cd prompt-studio-api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your local settings

# Start database with Docker
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

#### 3. Frontend Setup

```bash
cd prompt-studio

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env to point to backend: VITE_API_BASE_URL=http://localhost:3001/api

# Start frontend server
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 4. Access Application

Open browser and navigate to `http://localhost:5173`

## Docker Deployment

### Option 1: Separate Containers (Recommended for Development)

#### Backend

```bash
cd prompt-studio-api

# Start backend with all services
docker-compose up -d

# Check logs
docker-compose logs -f api
```

Backend API: `http://localhost:3001`
Adminer (Database UI): `http://localhost:8080`

#### Frontend

```bash
cd prompt-studio

# Build and start frontend
docker-compose up -d

# Check logs
docker-compose logs -f frontend
```

Frontend: `http://localhost:5173`

### Option 2: Complete Stack with Single Docker Compose

Create a `docker-compose.full-stack.yml` in parent directory:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: prompt-studio-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: prompt_studio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d prompt_studio"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - prompt-studio-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: prompt-studio-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass redis123
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "redis123", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - prompt-studio-network

  # Backend API
  api:
    build:
      context: ./prompt-studio-api
      dockerfile: Dockerfile
    container_name: prompt-studio-api
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/prompt_studio?schema=public
      REDIS_URL: redis://:redis123@redis:6379
      JWT_SECRET: ${JWT_SECRET:-change-this-secret-in-production}
      JWT_EXPIRES_IN: 15m
      REFRESH_TOKEN_EXPIRES_IN: 7d
      CORS_ORIGIN: http://localhost:5173
    ports:
      - "3001:3001"
    networks:
      - prompt-studio-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./prompt-studio
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://localhost:3001/api
    container_name: prompt-studio-frontend
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    ports:
      - "5173:80"
    networks:
      - prompt-studio-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:

networks:
  prompt-studio-network:
    driver: bridge
```

Deploy the complete stack:

```bash
# From parent directory containing both repos
docker-compose -f docker-compose.full-stack.yml up -d

# Check all services
docker-compose -f docker-compose.full-stack.yml ps

# View logs
docker-compose -f docker-compose.full-stack.yml logs -f

# Stop all services
docker-compose -f docker-compose.full-stack.yml down
```

## Production Deployment

### Prerequisites

- Server with Docker and Docker Compose
- Domain name (optional, recommended)
- SSL certificate (Let's Encrypt recommended)

### Production Setup

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/prompt-studio
cd /opt/prompt-studio
```

#### 2. Clone Repositories

```bash
git clone <backend-repo-url> prompt-studio-api
git clone <frontend-repo-url> prompt-studio
```

#### 3. Configure Environment Variables

Backend (.env.production):
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@postgres:5432/prompt_studio?schema=public
REDIS_URL=redis://:password@redis:6379
JWT_SECRET=your-super-secure-secret-min-32-chars
CORS_ORIGIN=https://yourdomain.com
```

Frontend (.env.production):
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Prompt Studio
VITE_ENABLE_MOCK_DATA=false
```

#### 4. Setup with Nginx Reverse Proxy

Create `nginx.conf`:

```nginx
upstream frontend {
    server frontend:80;
}

upstream api {
    server api:3001;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Add Nginx to docker-compose:

```yaml
  nginx:
    image: nginx:alpine
    container_name: prompt-studio-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - api
    networks:
      - prompt-studio-network
```

#### 5. SSL Certificate with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

#### 6. Deploy

```bash
# Build and start all services
docker-compose -f docker-compose.full-stack.yml up -d

# Check status
docker-compose -f docker-compose.full-stack.yml ps

# View logs
docker-compose -f docker-compose.full-stack.yml logs -f
```

## Cloud Deployment

### AWS Deployment

#### Using EC2

1. Launch EC2 instance (t2.medium or larger)
2. Configure security groups (ports 80, 443, 22)
3. Follow production setup steps above
4. Use Route 53 for DNS
5. Use AWS Certificate Manager for SSL

#### Using ECS

1. Build and push Docker images to ECR
2. Create ECS cluster
3. Define task definitions for each service
4. Create services
5. Use Application Load Balancer
6. Configure Auto Scaling

### Google Cloud Platform

#### Using Compute Engine

1. Create VM instance
2. Follow production setup steps
3. Use Cloud DNS
4. Configure Cloud Load Balancer
5. Use Google-managed SSL certificates

#### Using Cloud Run

1. Build Docker images
2. Push to Google Container Registry
3. Deploy each service to Cloud Run
4. Configure Cloud SQL for PostgreSQL
5. Use Cloud Memorystore for Redis

### DigitalOcean

1. Create Droplet (4GB RAM minimum)
2. Follow production setup steps
3. Use DigitalOcean DNS
4. Configure Load Balancer
5. Use managed PostgreSQL database
6. Use managed Redis cache

### Vercel + Railway

#### Frontend on Vercel

```bash
cd prompt-studio

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure environment variables in Vercel dashboard.

#### Backend on Railway

1. Connect GitHub repository
2. Configure environment variables
3. Add PostgreSQL and Redis plugins
4. Deploy automatically on push

## Environment Configuration

### Backend Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public

# Redis
REDIS_URL=redis://password@host:6379

# JWT
JWT_SECRET=your-secret-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Frontend Environment Variables

```bash
# API
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000

# App
VITE_APP_NAME=Prompt Studio
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_MOCK_DATA=false
```

## Monitoring and Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Frontend health
curl http://localhost:5173/health

# Check all services
docker-compose ps
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 api
```

### Backups

#### Database Backup

```bash
# Backup
docker exec prompt-studio-db pg_dump -U postgres prompt_studio > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20240101.sql | docker exec -i prompt-studio-db psql -U postgres prompt_studio
```

#### Automated Backups

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /opt/prompt-studio/scripts/backup.sh
```

### Updates

```bash
# Pull latest code
cd /opt/prompt-studio/prompt-studio-api
git pull origin main

cd /opt/prompt-studio/prompt-studio
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.full-stack.yml up -d --build

# Run migrations if needed
docker-compose exec api npm run db:migrate
```

## Troubleshooting

### Common Issues

**Issue: Cannot connect to API**
- Check API is running: `docker-compose ps api`
- Check API logs: `docker-compose logs api`
- Verify `VITE_API_BASE_URL` in frontend
- Check CORS settings in backend

**Issue: Database connection failed**
- Check PostgreSQL is running: `docker-compose ps postgres`
- Verify `DATABASE_URL` is correct
- Check database logs: `docker-compose logs postgres`

**Issue: Frontend shows blank page**
- Check browser console for errors
- Verify build completed: `docker-compose logs frontend`
- Check nginx configuration
- Verify static files are served correctly

**Issue: OAuth not working**
- Verify OAuth credentials are set
- Check callback URLs match
- Ensure HTTPS in production

### Debug Mode

Enable debug logging:

Backend:
```bash
LOG_LEVEL=debug
```

Frontend:
```bash
VITE_DEBUG=true
```

### Performance Issues

- Check resource usage: `docker stats`
- Review slow queries in database
- Monitor Redis hit rate
- Check network latency
- Review application logs for errors

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Enable rate limiting
- [ ] Setup security headers
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Monitor access logs
- [ ] Implement fail2ban or similar

## Support

For issues and questions:
- Check logs first
- Review this documentation
- Open GitHub issue
- Contact support team

## License

MIT License - See LICENSE file for details
