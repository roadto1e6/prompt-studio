#!/bin/bash

# ================================================
# Prompt Studio - Linux/Mac Startup Script
# ================================================

set -e

echo "================================================"
echo "Prompt Studio - One-Click Deployment"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "[WARNING] .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "Please edit .env file and configure your settings:"
    echo "  - JWT_SECRET: Change to a secure random string (run: openssl rand -hex 32)"
    echo "  - DB_PASSWORD: Set a strong database password"
    echo "  - REDIS_PASSWORD: Set a strong Redis password"
    echo ""
    echo "Opening .env file for editing..."
    ${EDITOR:-nano} .env
    echo ""
    read -p "Press Enter to continue after saving your changes..."
fi

echo ""
echo "[1/5] Pulling latest images..."
docker-compose pull

echo ""
echo "[2/5] Building images..."
docker-compose build --no-cache

echo ""
echo "[3/5] Starting services..."
docker-compose up -d

echo ""
echo "[4/5] Waiting for services to be healthy..."
sleep 15

# Wait for PostgreSQL
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres -d prompt_studio > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo " Ready!"

echo ""
echo "[5/5] Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy

echo ""
echo "================================================"
echo "Deployment completed successfully!"
echo "================================================"
echo ""
echo "Services are running:"
echo "  Frontend:  http://localhost"
echo "  Backend:   http://localhost/api"
echo "  Health:    http://localhost/health"
echo ""
echo "Useful commands:"
echo "  View logs:  docker-compose logs -f"
echo "  Stop:       docker-compose down"
echo "  Restart:    docker-compose restart"
echo ""
echo "================================================"
