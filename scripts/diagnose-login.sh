#!/bin/bash

echo "🔍 Login Diagnostic Tool"
echo "========================"
echo ""

# Check if backend is running
echo "1. Checking Backend Server..."
if curl -s http://localhost:5001 > /dev/null 2>&1; then
    echo "   ✓ Backend is running on port 5001"
else
    echo "   ✗ Backend is NOT running"
    echo "   → Start it with: cd backend && npm start"
    exit 1
fi

# Check MongoDB connection
echo ""
echo "2. Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "   ✓ MongoDB is running"
else
    echo "   ✗ MongoDB is NOT running"
    echo "   → Start it with: mongod"
    echo "   → Or: brew services start mongodb-community"
fi

# Check if frontend is running
echo ""
echo "3. Checking Frontend Server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✓ Frontend is running on port 3000"
else
    echo "   ✗ Frontend is NOT running"
    echo "   → Start it with: cd frontend && npm start"
fi

# Check environment files
echo ""
echo "4. Checking Environment Configuration..."
if [ -f "backend/.env" ]; then
    echo "   ✓ Backend .env exists"
    BACKEND_PORT=$(grep "PORT=" backend/.env | cut -d '=' -f2)
    echo "     PORT=$BACKEND_PORT"
else
    echo "   ✗ Backend .env NOT found"
fi

if [ -f "frontend/.env" ]; then
    echo "   ✓ Frontend .env exists"
    FRONTEND_URL=$(grep "REACT_APP_BASE_URL=" frontend/.env | cut -d '=' -f2)
    echo "     REACT_APP_BASE_URL=$FRONTEND_URL"
else
    echo "   ✗ Frontend .env NOT found"
fi

# Test admin registration
echo ""
echo "5. Testing Admin Registration..."
REG_RESPONSE=$(curl -s -X POST http://localhost:5001/AdminReg \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Diagnostic Test Admin",
    "email": "diagnostic@test.com",
    "password": "test123",
    "schoolName": "Diagnostic Test School"
  }')

if echo "$REG_RESPONSE" | grep -q "token"; then
    echo "   ✓ Registration successful"
elif echo "$REG_RESPONSE" | grep -q "already exists"; then
    echo "   ℹ Admin already exists (this is OK)"
else
    echo "   ✗ Registration failed"
    echo "   Response: $REG_RESPONSE"
fi

# Test admin login
echo ""
echo "6. Testing Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/AdminLogin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "diagnostic@test.com",
    "password": "test123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "   ✓ Login successful!"
    echo ""
    echo "✅ Everything is working correctly!"
    echo ""
    echo "📝 You can now login with:"
    echo "   Email: diagnostic@test.com"
    echo "   Password: test123"
elif echo "$LOGIN_RESPONSE" | grep -q "Invalid password"; then
    echo "   ✗ Invalid password"
    echo "   Response: $LOGIN_RESPONSE"
elif echo "$LOGIN_RESPONSE" | grep -q "User not found"; then
    echo "   ✗ User not found"
    echo "   → Try registering first"
else
    echo "   ✗ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi

echo ""
echo "========================"
echo "Diagnostic Complete"
