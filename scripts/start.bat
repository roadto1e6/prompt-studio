@echo off
REM ================================================
REM Prompt Studio - Windows Startup Script
REM ================================================

echo ================================================
echo Prompt Studio - One-Click Deployment
echo ================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo.
    echo Please edit .env file and configure your settings:
    echo   - JWT_SECRET: Change to a secure random string
    echo   - DB_PASSWORD: Set a strong database password
    echo   - REDIS_PASSWORD: Set a strong Redis password
    echo.
    echo Opening .env file...
    notepad .env
    echo.
    pause
)

echo.
echo [1/5] Pulling latest images...
docker-compose pull

echo.
echo [2/5] Building images...
docker-compose build --no-cache

echo.
echo [3/5] Starting services...
docker-compose up -d

echo.
echo [4/5] Waiting for services to be healthy...
timeout /t 15 /nobreak >nul

REM Wait for PostgreSQL
echo Waiting for PostgreSQL to be ready...
:wait_postgres
docker-compose exec -T postgres pg_isready -U postgres -d prompt_studio >nul 2>&1
if %errorlevel% neq 0 (
    echo .
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)
echo PostgreSQL is ready!

echo.
echo [5/5] Running database migrations...
docker-compose exec -T backend npx prisma migrate deploy

echo.
echo ================================================
echo Deployment completed successfully!
echo ================================================
echo.
echo Services are running:
echo   Frontend:  http://localhost
echo   Backend:   http://localhost/api
echo   Health:    http://localhost/health
echo.
echo Useful commands:
echo   View logs:  docker-compose logs -f
echo   Stop:       docker-compose down
echo   Restart:    docker-compose restart
echo.
echo ================================================

pause
