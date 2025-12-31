#!/bin/sh
# Backend entrypoint script
# Runs database migrations then starts the application

set -e

echo "[Entrypoint] Starting Prompt Studio Backend..."

# Wait for database to be ready (optional extra check)
echo "[Entrypoint] Waiting for database..."
sleep 2

# Run database migrations
echo "[Entrypoint] Running database migrations..."
npx prisma db push --accept-data-loss

echo "[Entrypoint] Starting application..."
exec node dist/app.js
