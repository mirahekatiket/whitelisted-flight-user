#!/bin/bash

# Flight Booking System - Development Startup Script
# This script starts both backend and frontend services

echo "🚀 Starting Flight Booking System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend directory exists
if [ ! -d "flight-go" ]; then
    echo "❌ Backend directory 'flight-go' not found!"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "whitelisted-flight-user-dashboard" ]; then
    echo "❌ Frontend directory 'whitelisted-flight-user-dashboard' not found!"
    exit 1
fi

# Start Backend
echo -e "${BLUE}Starting Backend (Go API)...${NC}"
cd flight-go
go mod tidy > /dev/null 2>&1

# Start backend in background
go run cmd/server/main.go &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started on http://localhost:8080 (PID: $BACKEND_PID)${NC}"
echo -e "${YELLOW}  Swagger: http://localhost:8080/swagger/index.html${NC}"
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start Frontend
echo ""
echo -e "${BLUE}Starting Frontend (Next.js)...${NC}"
cd whitelisted-flight-user-dashboard

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
fi

npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)${NC}"
cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "📱 Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "🔧 Backend:   ${BLUE}http://localhost:8080${NC}"
echo -e "📚 Swagger:   ${BLUE}http://localhost:8080/swagger/index.html${NC}"
echo ""
echo -e "🔐 Default Admin Login:"
echo -e "   Email:    admin@tiket.com"
echo -e "   Password: admin123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Save PIDs to file for cleanup
echo "$BACKEND_PID" > .dev-pids
echo "$FRONTEND_PID" >> .dev-pids

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .dev-pids; echo '✓ Services stopped'; exit 0" INT TERM

# Keep script running
wait

