#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Speech-to-Text Web App${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js is installed${NC}"
echo ""

# Start backend
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd server
npm start &
SERVER_PID=$!

sleep 2

# Start frontend
echo -e "${YELLOW}Starting Frontend Server...${NC}"
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Both servers started!${NC}"
echo ""
echo "Backend:  http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $SERVER_PID $FRONTEND_PID
