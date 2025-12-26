# Prompt Studio

A modern, full-stack prompt management system with version control, collections, and sharing capabilities. Built with React, TypeScript, Fastify, and PostgreSQL.

## Features

### Core Functionality
- **Prompt Management**: Create, edit, organize and version your AI prompts
- **Version Control**: Track changes with detailed version history and diff viewing
- **Collections**: Organize prompts into collections with custom colors and icons
- **Sharing**: Share prompts with others using short codes, passwords, and expiration
- **Multi-language**: English and Chinese (Simplified) interface
- **Theme Support**: Seamless dark/light mode switching
- **Model Management**: Support for multiple AI providers (OpenAI, Anthropic, etc.)

### User Experience
- **Keyboard Shortcuts**: Quick actions with intuitive shortcuts
- **Responsive Design**: Beautiful on desktop and mobile
- **Real-time Search**: Instant filtering across all prompts
- **Drag & Drop**: Intuitive organization
- **Import/Export**: Easy backup and migration

### Authentication
- **Email/Password**: Secure traditional authentication
- **OAuth**: Google and GitHub login
- **Password Reset**: Secure recovery flow
- **Session Management**: Automatic token refresh

## Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Fastify** - High-performance Node.js framework
- **PostgreSQL 16** - Primary database with full-text search
- **Redis 7** - Caching and session management
- **Prisma** - Type-safe database ORM
- **JWT** - Stateless authentication
- **Zod** - Runtime validation

### DevOps
- **Docker** + **Docker Compose** - Complete containerization
- **Nginx** - Reverse proxy and static file serving
- **Multi-stage Builds** - Optimized image sizes

## Project Structure

```
prompt-studio/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   │   ├── components/  # React components
│   │   ├── features/    # Feature modules
│   │   ├── services/    # API services
│   │   ├── stores/      # Zustand stores
│   │   └── types/       # TypeScript types
│   ├── public/        # Static assets
│   ├── Dockerfile     # Frontend container
│   └── nginx.conf     # Nginx configuration
│
├── backend/           # Fastify backend API
│   ├── src/          # Source code
│   │   ├── modules/    # Feature modules
│   │   ├── middlewares/  # Middleware
│   │   ├── config/     # Configuration
│   │   └── utils/      # Utilities
│   ├── prisma/       # Database schema
│   ├── Dockerfile    # Backend container
│   └── .env.example  # Environment template
│
├── docker/           # Docker configurations
│   ├── nginx.conf    # Reverse proxy config
│   └── init-db.sql   # Database initialization
│
├── scripts/          # Utility scripts
│   ├── start.bat     # Windows startup
│   └── start.sh      # Linux/Mac startup
│
├── docker-compose.yml # Service orchestration
├── .env              # Environment variables
├── .env.example      # Environment template
└── README.md         # This file
```

## Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** (optional, for cloning)

### One-Click Deployment

#### Windows

```batch
# 1. Configure environment variables
copy .env.example .env
notepad .env

# 2. Run the startup script
scripts\start.bat
```

#### Linux/Mac

```bash
# 1. Configure environment variables
cp .env.example .env
nano .env  # or vim, code, etc.

# 2. Run the startup script
chmod +x scripts/start.sh
./scripts/start.sh
```

#### Manual Deployment

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and set your configuration

# 2. Start all services
docker-compose up -d

# 3. View logs to monitor startup
docker-compose logs -f

# 4. Run database migrations (if needed)
docker-compose exec backend npx prisma migrate deploy
```

### Access the Application

Once deployed, access at:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Health Check**: http://localhost/health
- **API Health**: http://localhost/api-health

## Environment Configuration

Create a `.env` file from `.env.example` and configure:

### Required Settings

```env
# JWT Secret (IMPORTANT: Change in production!)
# Generate with: openssl rand -hex 32
JWT_SECRET=your-secure-random-string-min-32-characters

# Database Password
DB_PASSWORD=your-database-password

# Redis Password
REDIS_PASSWORD=your-redis-password
```

### Optional Settings

```env
# Service Ports
FRONTEND_PORT=80

# CORS (change for production)
CORS_ORIGIN=http://localhost
FRONTEND_URL=http://localhost

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth (GitHub)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Development

### Local Development (Hot Reload)

For development with hot reload:

```bash
# 1. Start only database services
docker-compose up -d postgres redis

# 2. Start backend (Terminal 1)
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev  # Runs on http://localhost:3001

# 3. Start frontend (Terminal 2)
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

**Note**: For local development, create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Building for Production

```bash
# Build all images
docker-compose build

# Start production stack
docker-compose up -d
```

## Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs (all services)
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build
```

### Container Management

```bash
# Check service status
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres prompt_studio

# Remove everything (including volumes)
docker-compose down -v

# Remove images too
docker-compose down -v --rmi all
```

## Database Management

### Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres prompt_studio > backup.sql

# Backup with timestamp
docker-compose exec postgres pg_dump -U postgres prompt_studio > backup-$(date +%Y%m%d-%H%M%S).sql

# Backup volumes
docker run --rm -v prompt-studio-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
```

### Restore

```bash
# Restore from SQL dump
docker-compose exec -T postgres psql -U postgres prompt_studio < backup.sql

# Restore volumes
docker run --rm -v prompt-studio-postgres-data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres-backup.tar.gz -C /data
```

### Migrations

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Create new migration (development)
cd backend
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
docker-compose exec backend npx prisma migrate reset

# Open Prisma Studio (Database GUI)
docker-compose exec backend npx prisma studio
```

## Troubleshooting

### Port Already in Use

If port 80 is already in use:

```env
# In .env file
FRONTEND_PORT=8080
```

Then restart:
```bash
docker-compose down && docker-compose up -d
```

### Database Connection Failed

1. Check if PostgreSQL is healthy:
   ```bash
   docker-compose ps postgres
   docker-compose logs postgres
   ```

2. Verify connection string in .env:
   ```env
   DB_USER=postgres
   DB_PASSWORD=postgres123
   DB_NAME=prompt_studio
   ```

3. Restart PostgreSQL:
   ```bash
   docker-compose restart postgres
   ```

### Frontend Can't Connect to Backend

1. Check Nginx proxy configuration:
   ```bash
   docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
   ```

2. Test backend directly:
   ```bash
   curl http://localhost/api-health
   ```

3. Check backend logs:
   ```bash
   docker-compose logs backend | tail -50
   ```

### CORS Errors

Ensure `CORS_ORIGIN` in `.env` matches your frontend URL:

```env
# For local Docker deployment
CORS_ORIGIN=http://localhost

# For production
CORS_ORIGIN=https://yourdomain.com
```

### Clear Everything and Start Fresh

```bash
# Stop and remove all containers, volumes, and images
docker-compose down -v --rmi all

# Remove orphaned volumes
docker volume prune

# Rebuild and start
docker-compose up -d --build
```

## Architecture

### Network Flow

```
External Request (localhost:80)
         ↓
  [Nginx Container]
         ├─→ /api/*      → [Backend:3001]
         │                      ↓
         │                  [PostgreSQL:5432]
         │                      ↓
         │                  [Redis:6379]
         │
         └─→ /* (other)  → Static Files (React SPA)
```

### Service Dependencies

```
1. PostgreSQL starts → Health check passes
         ↓
2. Redis starts → Health check passes
         ↓
3. Backend starts → Connects to DB/Redis → Health check passes
         ↓
4. Frontend starts → Nginx serves static files → Proxies /api to backend
```

### Security Features

- **JWT Authentication**: Stateless, secure tokens
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configurable origins
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: Security headers in Nginx
- **Rate Limiting**: Configurable rate limits on sensitive endpoints
- **Non-root Containers**: All containers run as non-root users

## Security Considerations

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string (min 32 chars)
- [ ] Use strong passwords for `DB_PASSWORD` and `REDIS_PASSWORD`
- [ ] Update `CORS_ORIGIN` to your production domain
- [ ] Set up HTTPS with SSL/TLS certificates (use nginx-proxy + Let's Encrypt)
- [ ] Configure firewall rules (only expose ports 80/443)
- [ ] Enable Docker security scanning
- [ ] Regular security updates (`docker-compose pull`)
- [ ] Set up backup automation
- [ ] Configure logging and monitoring
- [ ] Review and restrict OAuth redirect URIs

### Generate Secure Secrets

```bash
# Generate JWT secret (64 characters)
openssl rand -hex 32

# Generate strong passwords (32 characters)
openssl rand -base64 24

# Generate all secrets at once
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "DB_PASSWORD=$(openssl rand -base64 24)"
echo "REDIS_PASSWORD=$(openssl rand -base64 24)"
```

## Performance Optimization

- **Redis Caching**: 256MB memory with LRU eviction policy
- **Nginx Gzip**: Enabled for all text-based responses
- **Static Asset Caching**: 1-year cache for immutable assets (JS, CSS, images)
- **HTML No-Cache**: Ensures SPA always gets latest index.html
- **PostgreSQL Connection Pooling**: Prisma connection pooling enabled
- **Multi-stage Docker Builds**: Minimal production images
- **Alpine Base Images**: Smaller image sizes (~5-50MB vs 100+MB)

## Monitoring

### Check Service Health

```bash
# All services
docker-compose ps

# Frontend health
curl http://localhost/health

# Backend health
curl http://localhost/api-health

# PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Redis
docker-compose exec redis redis-cli -a redis123 ping
```

### View Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Logs size
docker-compose logs --tail=100 | wc -l
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (both frontend and backend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose logs`
3. Check existing GitHub issues
4. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Docker logs
   - Environment details

## Roadmap

- [ ] Real-time collaboration
- [ ] Advanced search with filters
- [ ] Prompt templates marketplace
- [ ] API usage analytics
- [ ] Webhook integrations
- [ ] Team workspaces
- [ ] Advanced permissions

## Credits

Built with modern web technologies and best practices for production-ready deployments.

---

**Enjoy using Prompt Studio!** 🚀

For detailed Chinese documentation, see `frontend/README.zh-CN.md`
