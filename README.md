# Campus-Management-System
A unified campus platform that streamlines event management, role-based approvals, and resource booking

## Problem Statement
Campus events and shared resources are often managed using fragmented tools such as Google Forms, spreadsheets, and messaging apps. This leads to poor coordination, booking conflicts, and lack of accountability.
This project provides a unified platform to manage campus events, role-based approvals, and conflict-free resource booking through a secure backend system.

## Key Features
- Role-based authentication (Admin, Organizer, Participant)
- Event creation and approval workflow
- Centralized campus resource management
- Conflict-free resource booking system
- Secure REST APIs
- Transaction-safe booking approvals

## Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Node.js, Express 5
- **Database:** MySQL 8.0
- **Deployment:** Docker, Docker Compose

## Project Structure
```
Campus-Management-System/
├── campus-backend/       # Express API server  # SQL schema & seed files
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/           
│   │   ├── middleware/
│   │   └── routes/
│   └── Dockerfile
├── frontend/             # Next.js app
│   ├── src/
│   │   ├── app/          # Pages & layouts
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── services/     # API services
│   │   └── styles/       # CSS modules
│   └── Dockerfile
├── deployment/           # All deployment configs
│   ├── docker-compose.yml
│   ├── platform-configs/ # Railway, Render, Vercel configs
│   └── scripts/
└── .github/              # CI/CD workflows
```

## Quick Start

### Prerequisites
- Docker Desktop installed and running

### Run the Application
```bash
cd deployment
docker-compose up -d
```

Or from root directory:
```bash
docker-compose -f deployment/docker-compose.yml up -d
```

### Access
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5001

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | password123 |
| Organizer | organizer@test.com | password123 |
| Participant | participant@test.com | password123 |

### Stop the Application
```bash
cd deployment
docker-compose down
```

### Rebuild After Code Changes
```bash
cd deployment
docker-compose up -d --build
```

## Demo

## Team
- Frontend: Sushant Patil
- Backend: Aneesh A Srivattsa
- Deployment: Pratheek Shenoy
