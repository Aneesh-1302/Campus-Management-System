#!/bin/bash

# ============================================
# Quick Start Script for Hackathon Demo
# ============================================

set -e

echo ""
echo "🚀 Campus Management System - Quick Start"
echo "==========================================="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker Desktop: https://www.docker.com/get-started"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop"
    exit 1
fi

echo "✅ Docker is ready"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
fi

# Start services
echo "🐳 Starting services..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Check health
echo "🔍 Checking services..."

BACKEND_OK=false
FRONTEND_OK=false

for i in {1..5}; do
    if curl -s http://localhost:5000/health | grep -q "ok"; then
        BACKEND_OK=true
        break
    fi
    sleep 5
done

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null | grep -q "200"; then
    FRONTEND_OK=true
fi

echo ""
echo "==========================================="
if [ "$BACKEND_OK" = true ]; then
    echo "✅ Backend:  http://localhost:5000"
else
    echo "⚠️  Backend:  Still starting..."
fi

if [ "$FRONTEND_OK" = true ]; then
    echo "✅ Frontend: http://localhost:3001"
else
    echo "⚠️  Frontend: Still starting..."
fi
echo "==========================================="
echo ""
echo "📋 Commands:"
echo "   Stop:    docker-compose down"
echo "   Logs:    docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo ""

# Open browser (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "Open in browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open http://localhost:3001
    fi
fi
