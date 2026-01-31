# 🚀 Campus Management System - Deployment Guide

Complete deployment guide for the Campus Management System hackathon project.

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Option 1: Deploy with Docker (Recommended for Demo)](#option-1-deploy-with-docker-locally)
- [Option 2: Deploy to Railway](#option-2-deploy-to-railway)
- [Option 3: Deploy to Render](#option-3-deploy-to-render)
- [Option 4: Deploy to Vercel + PlanetScale](#option-4-deploy-to-vercel--planetscale)
- [Environment Variables Reference](#environment-variables-reference)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│     MySQL       │
│   (Next.js)     │     │   (Express)     │     │    Database     │
│   Port: 3001    │     │   Port: 5000    │     │   Port: 3306    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Tech Stack:**
- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Node.js, Express 5, ES Modules
- **Database**: MySQL 8.0
- **Authentication**: JWT

---

## ✅ Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/) (for local deployment)
- [Git](https://git-scm.com/)
- A GitHub account (for cloud deployments)

---

## 🐳 Option 1: Deploy with Docker (Locally)

**Best for**: Hackathon demo, local testing

### Step 1: Clone and Navigate
```bash
cd Campus-Management-System
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with secure values:
```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
DB_USER=campus_user
DB_PASS=your_secure_password
DB_NAME=campus_db
JWT_SECRET=generate-a-64-char-random-string
```

### Step 3: Start All Services
```bash
docker-compose up -d
```

### Step 4: Verify Deployment
```bash
# Check all containers are running
docker-compose ps

# Check backend health
curl http://localhost:5000/health

# View logs
docker-compose logs -f
```

### Step 5: Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Useful Docker Commands
```bash
# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## 🚂 Option 2: Deploy to Railway

**Best for**: Free cloud hosting with MySQL support

### Step 1: Install Railway CLI
```bash
# macOS
brew install railway

# or using npm
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Deploy MySQL Database
1. Go to [railway.app](https://railway.app)
2. Create new project → "Deploy a Template" → Select **MySQL**
3. Once deployed, click on MySQL service → "Variables" tab
4. Copy these values:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

### Step 4: Initialize Database
Connect to Railway MySQL and run schema:
```bash
# Using Railway CLI
railway connect mysql

# Then in MySQL shell, paste contents of schema.sql and seed.sql
```

Or use a MySQL client (TablePlus, DBeaver, etc.) with the connection details.

### Step 5: Deploy Backend
```bash
cd campus-backend

# Initialize Railway in backend folder
railway init

# Link to your project
railway link

# Set environment variables
railway variables set DB_HOST="your-mysql-host.railway.app"
railway variables set DB_USER="your-mysql-user"
railway variables set DB_PASS="your-mysql-password"
railway variables set DB_NAME="railway"
railway variables set JWT_SECRET="your-64-char-secret"
railway variables set NODE_ENV="production"

# Deploy
railway up

# Get your backend URL
railway domain
```

Note your backend URL: `https://campus-backend-xxx.up.railway.app`

### Step 6: Deploy Frontend
```bash
cd ../frontend

# Initialize Railway in frontend folder
railway init

# Set environment variables
railway variables set NEXT_PUBLIC_API_URL="https://your-backend-url.up.railway.app"

# Deploy
railway up

# Get your frontend URL
railway domain
```

### Step 7: Update Backend CORS
```bash
cd ../campus-backend
railway variables set FRONTEND_URL="https://your-frontend-url.up.railway.app"
railway up
```

---

## 🎨 Option 3: Deploy to Render

**Best for**: Easy deployment with free tier

### Step 1: Create Render Account
Go to [render.com](https://render.com) and sign up with GitHub

### Step 2: Create MySQL Database
Render doesn't have MySQL, so use one of these:
- [PlanetScale](https://planetscale.com) (Recommended - free tier)
- [Aiven](https://aiven.io) (free tier)
- [Railway MySQL](#option-2-deploy-to-railway) (then deploy app on Render)

### Step 3: Deploy Backend
1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `campus-backend`
   - **Root Directory**: `campus-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add Environment Variables:
   - `DB_HOST` = your MySQL host
   - `DB_USER` = your MySQL user
   - `DB_PASS` = your MySQL password
   - `DB_NAME` = your database name
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
5. Click **Create Web Service**

### Step 4: Deploy Frontend
1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `campus-frontend`
   - **Root Directory**: `frontend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = your backend Render URL
5. Click **Create Web Service**

---

## ⚡ Option 4: Deploy to Vercel + PlanetScale

**Best for**: Best performance for Next.js frontend

### Step 1: Set Up PlanetScale (MySQL)
1. Go to [planetscale.com](https://planetscale.com)
2. Create account and new database
3. Create a branch (e.g., `main`)
4. Go to **Connect** → Select **Node.js** → Copy credentials
5. Use the **Console** to run `schema.sql` and `seed.sql`

### Step 2: Deploy Backend to Railway/Render
Follow Option 2 or 3 for backend, using PlanetScale credentials:
```env
DB_HOST=aws.connect.psdb.cloud
DB_USER=your-planetscale-user
DB_PASS=your-planetscale-password
DB_NAME=your-database-name
```

### Step 3: Deploy Frontend to Vercel
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-url

# Deploy to production
vercel --prod
```

---

## 🔐 Environment Variables Reference

### Backend (`campus-backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` or `mysql.railway.app` |
| `DB_USER` | MySQL username | `campus_user` |
| `DB_PASS` | MySQL password | `secure_password` |
| `DB_NAME` | Database name | `campus_db` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `JWT_SECRET` | JWT signing key | `64-char-random-string` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3001` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

### Generate JWT Secret
```bash
# macOS/Linux
openssl rand -base64 64

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -h <host> -u <user> -p<password> <database>

# Check if database exists
SHOW DATABASES;

# Check tables
USE campus_db;
SHOW TABLES;
```

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend domain
- Check that the backend CORS middleware is properly configured

### Container Issues
```bash
# View container logs
docker-compose logs -f <service-name>

# Restart specific container
docker-compose restart backend

# Rebuild specific container
docker-compose up -d --build backend
```

### Railway Deployment Issues
```bash
# Check deployment logs
railway logs

# Check service status
railway status

# Redeploy
railway up --detach
```

### Frontend Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📱 Quick Reference

### Local Development
```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down
```

### Production URLs (after deployment)
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.railway.app`
- Health Check: `https://your-backend.railway.app/health`

### API Endpoints
- `GET /health` - Health check
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /resources` - List resources
- `POST /bookings` - Create booking

---

## 🎉 Hackathon Demo Checklist

- [ ] Database is seeded with sample data
- [ ] Backend health endpoint returns `{ "status": "ok" }`
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Resources are displayed
- [ ] Booking creation works
- [ ] Role-based access works (Admin, Organizer, Participant)

---

**Good luck with your hackathon! 🚀**
