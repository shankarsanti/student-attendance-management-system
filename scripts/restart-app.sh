#!/bin/bash

# MERN School Management System - Restart Script
# This script helps restart the application with a clean state

echo "🔄 MERN School Management System - Clean Restart"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not running${NC}"
    echo "  Start it with: mongod"
    echo "  Or: brew services start mongodb-community"
    echo ""
fi

# Kill any existing processes on ports 3000 and 5001
echo ""
echo "🔍 Checking for existing processes..."

# Check port 5001 (backend)
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Port 5001 is in use. Killing process...${NC}"
    lsof -ti:5001 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✓ Port 5001 freed${NC}"
else
    echo -e "${GREEN}✓ Port 5001 is available${NC}"
fi

# Check port 3000 (frontend)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Port 3000 is in use. Killing process...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✓ Port 3000 freed${NC}"
else
    echo -e "${GREEN}✓ Port 3000 is available${NC}"
fi

# Clear frontend cache
echo ""
echo "🧹 Clearing frontend cache..."
if [ -d "frontend/node_modules/.cache" ]; then
    rm -rf frontend/node_modules/.cache
    echo -e "${GREEN}✓ Frontend cache cleared${NC}"
else
    echo -e "${GREEN}✓ No cache to clear${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}✓ Cleanup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Start backend:  cd backend && npm start"
echo "2. Start frontend: cd frontend && npm start"
echo "3. Clear browser cache: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo "4. Open: http://localhost:3000"
echo ""
echo "💡 Tip: Open two terminal windows to run both servers simultaneously"
