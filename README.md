# SLA Monitoring System

A full-stack enterprise SLA Management System built with React, Express.js, Node.js, and MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, Recharts |
| Backend | Node.js, Express.js, JWT Auth |
| Database | MongoDB with Mongoose ODM |
| Real-time | Socket.IO |
| Styling | CSS Modules / custom CSS |

## Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# backend/.env
cp backend/.env.example backend/.env
# Fill in your MongoDB URI and JWT secret
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm start
```

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acme.com | Admin@123 |
| User | user@acme.com | User@123 |

## Project Structure

```
sla-monitor/
├── frontend/          # React application
│   └── src/
│       ├── pages/     # Route-level page components
│       ├── components/# Reusable UI components
│       ├── context/   # Auth & global state
│       ├── hooks/     # Custom React hooks
│       ├── api/       # Axios service layer
│       └── utils/     # Helper functions
└── backend/           # Express REST API
    ├── routes/        # API route definitions
    ├── models/        # Mongoose schemas
    ├── controllers/   # Business logic
    ├── middleware/     # Auth, role guards
    ├── config/        # DB connection, env
    └── utils/         # Helpers, scheduler
```
