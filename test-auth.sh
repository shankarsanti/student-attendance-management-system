#!/bin/bash

# Test Authentication Script
# This script tests the login endpoints to verify JWT token generation

echo "================================"
echo "Authentication Test Script"
echo "================================"
echo ""

# Check if backend is running
echo "Checking if backend is running on port 5001..."
if ! curl -s http://localhost:5001/health > /dev/null; then
    echo "❌ Backend is not running!"
    echo "Please start the backend first:"
    echo "  cd backend && npm start"
    exit 1
fi
echo "✅ Backend is running"
echo ""

# Test Admin Login
echo "Testing Admin Login..."
echo "Endpoint: POST /AdminLogin"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:5001/AdminLogin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}')

echo "Response: $ADMIN_RESPONSE"
if echo "$ADMIN_RESPONSE" | grep -q "token"; then
    echo "✅ Admin login returns token"
else
    echo "⚠️  Admin login response (check if user exists or credentials are correct)"
fi
echo ""

# Test Teacher Login
echo "Testing Teacher Login..."
echo "Endpoint: POST /TeacherLogin"
TEACHER_RESPONSE=$(curl -s -X POST http://localhost:5001/TeacherLogin \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"teacher123"}')

echo "Response: $TEACHER_RESPONSE"
if echo "$TEACHER_RESPONSE" | grep -q "token"; then
    echo "✅ Teacher login returns token"
else
    echo "⚠️  Teacher login response (check if user exists or credentials are correct)"
fi
echo ""

# Test Student Login
echo "Testing Student Login..."
echo "Endpoint: POST /StudentLogin"
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:5001/StudentLogin \
  -H "Content-Type: application/json" \
  -d '{"rollNum":"1","studentName":"Test Student","password":"student123"}')

echo "Response: $STUDENT_RESPONSE"
if echo "$STUDENT_RESPONSE" | grep -q "token"; then
    echo "✅ Student login returns token"
else
    echo "⚠️  Student login response (check if user exists or credentials are correct)"
fi
echo ""

echo "================================"
echo "Test Complete"
echo "================================"
echo ""
echo "Note: If you see 'User not found' messages, you need to:"
echo "1. Register users first, or"
echo "2. Use the correct credentials for existing users"
echo ""
echo "To test with actual users:"
echo "1. Start the frontend: cd frontend && npm start"
echo "2. Register an admin at http://localhost:3000/Adminregister"
echo "3. Login and create teachers/students"
echo "4. Test login with those credentials"
