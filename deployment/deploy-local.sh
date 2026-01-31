#!/bin/bash

# ============================================
# Campus Management System - Deployment Script
# ============================================
# This script helps deploy the application locally using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Header
echo ""
echo "============================================"
echo "  Campus Management System Deployment"
echo "============================================"
echo ""

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://www.docker.com/get-started"
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Check if Docker is running
check_docker_running() {
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    print_success "Docker is running"
}

# Create .env file if not exists
setup_env() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from .env.example..."
        cp .env.example .env
        
        # Generate a random JWT secret
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change-this-secret-in-production")
        
        # Update JWT_SECRET in .env (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
        else
            sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
        fi
        
        print_success ".env file created with auto-generated JWT secret"
    else
        print_warning ".env file already exists, skipping..."
    fi
}

# Build and start containers
deploy() {
    print_status "Building and starting containers..."
    docker-compose up -d --build
    
    print_status "Waiting for services to be healthy..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "All services are running!"
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Running health checks..."
    
    # Check backend
    if curl -s http://localhost:5000/health | grep -q "ok"; then
        print_success "Backend is healthy (http://localhost:5000)"
    else
        print_warning "Backend health check failed. It might still be starting..."
    fi
    
    # Check frontend
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200"; then
        print_success "Frontend is running (http://localhost:3001)"
    else
        print_warning "Frontend might still be starting..."
    fi
}

# Show status
show_status() {
    echo ""
    echo "============================================"
    echo "  Deployment Complete!"
    echo "============================================"
    echo ""
    echo "  Frontend:  http://localhost:3001"
    echo "  Backend:   http://localhost:5000"
    echo "  Health:    http://localhost:5000/health"
    echo ""
    echo "  Useful commands:"
    echo "    View logs:     docker-compose logs -f"
    echo "    Stop:          docker-compose down"
    echo "    Restart:       docker-compose restart"
    echo ""
    echo "============================================"
}

# Main function
main() {
    # Navigate to project root (where docker-compose.yml is)
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR/.."
    
    check_docker
    check_docker_compose
    check_docker_running
    setup_env
    deploy
    health_check
    show_status
}

# Run main function
main "$@"
