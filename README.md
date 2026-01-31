# Campus Management System – Backend

## Tech Stack
- Node.js
- Express
- MySQL
- JWT
- bcrypt

## Setup Instructions

### 1. Install dependencies
npm install

### 2. Setup environment variables
Create .env file with:
- DB_HOST=localhost
- DB_USER=campus_user
- DB_PASS=campus_password
- DB_NAME=campus_db
- JWT_SECRET=I'm Batman

### 3. Setup Database
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql

### 4. Start Server
npm run dev

Server runs at:
http://localhost:3000

## Seeded Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Organizer | organizer@test.com | org123 |
| Participant | participant@test.com | user123 
