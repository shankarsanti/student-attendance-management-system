#!/bin/bash

echo "🚀 Starting MERN School Management System"
echo "=========================================="
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js is installed"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed!"
    echo "Installing MongoDB via Homebrew..."
    brew tap mongodb/brew
    brew install mongodb-community
fi

echo "✓ MongoDB is installed"

# Start MongoDB
echo ""
echo "📊 Starting MongoDB..."
brew services start mongodb-community 2>/dev/null || mongod --fork --logpath /tmp/mongodb.log

sleep 2

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✓ MongoDB is running"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

# Install backend dependencies if needed
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo ""
    echo "📦 Installing backend dependencies..."
    cd "$SCRIPT_DIR/backend"
    npm install
fi

# Install frontend dependencies if needed
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo ""
    echo "📦 Installing frontend dependencies..."
    cd "$SCRIPT_DIR/frontend"
    npm install
fi

# Kill any existing processes on ports 5001 and 3000
echo ""
echo "🧹 Cleaning up existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start backend in background
echo ""
echo "🔧 Starting Backend Server..."
cd "$SCRIPT_DIR/backend"
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:5001 > /dev/null 2>&1; then
        echo "✓ Backend is running on port 5001"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start"
        echo "Check logs: tail -f /tmp/backend.log"
        exit 1
    fi
    sleep 1
done

# Start frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd "$SCRIPT_DIR/frontend"
echo "⏳ This will take a moment and open your browser automatically..."
echo ""
npm start

# This will keep running until you press Ctrl+C
