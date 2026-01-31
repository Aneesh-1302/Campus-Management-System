#!/bin/bash

# ============================================
# Railway Deployment Helper Script
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo ""
echo "============================================"
echo "  Railway Deployment Helper"
echo "============================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  brew install railway    # macOS"
    echo "  npm install -g @railway/cli    # npm"
    echo ""
    exit 1
fi

print_success "Railway CLI is installed"

# Check if logged in
if ! railway whoami &> /dev/null; then
    print_status "Please login to Railway..."
    railway login
fi

print_success "Logged in to Railway"

echo ""
echo "============================================"
echo "  Deployment Steps"
echo "============================================"
echo ""
echo "1. First, create a MySQL database on Railway:"
echo "   - Go to https://railway.app"
echo "   - Create a new project"
echo "   - Add a MySQL service"
echo "   - Copy the connection variables"
echo ""
echo "2. Initialize the database:"
echo "   - Connect to MySQL using: railway connect mysql"
echo "   - Run the schema.sql file"
echo "   - Run the seed.sql file"
echo ""
echo "3. Deploy the backend:"
echo "   cd campus-backend"
echo "   railway init"
echo "   railway link"
echo "   railway variables set DB_HOST=\"your-host\""
echo "   railway variables set DB_USER=\"your-user\""
echo "   railway variables set DB_PASS=\"your-password\""
echo "   railway variables set DB_NAME=\"your-database\""
echo "   railway variables set JWT_SECRET=\"$(openssl rand -base64 32)\""
echo "   railway variables set NODE_ENV=\"production\""
echo "   railway up"
echo "   railway domain  # Get your URL"
echo ""
echo "4. Deploy the frontend:"
echo "   cd ../frontend"
echo "   railway init"
echo "   railway link"
echo "   railway variables set NEXT_PUBLIC_API_URL=\"https://your-backend-url\""
echo "   railway up"
echo "   railway domain  # Get your URL"
echo ""
echo "5. Update backend CORS:"
echo "   cd ../campus-backend"
echo "   railway variables set FRONTEND_URL=\"https://your-frontend-url\""
echo ""
echo "============================================"
echo ""

read -p "Would you like to proceed with backend deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR/../campus-backend"
    
    print_status "Initializing Railway in campus-backend..."
    railway init
    
    echo ""
    print_warning "Now set your environment variables in Railway Dashboard or using:"
    echo "  railway variables set KEY=value"
    echo ""
    print_status "When ready, deploy with: railway up"
fi
