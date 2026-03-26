#!/bin/bash

# Deployment Verification Script
# This script checks if all necessary files are in place for deployment

echo "🔍 Checking Deployment Configuration..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 is missing"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 directory exists"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 directory is missing"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo "📁 Checking Frontend Files..."
check_file "frontend/vercel.json"
check_file "frontend/netlify.toml"
check_file "frontend/public/_redirects"
check_file "frontend/package.json"
check_file "frontend/.env"
check_dir "frontend/src"
check_dir "frontend/public"
echo ""

echo "📁 Checking Backend Files..."
check_file "backend/package.json"
check_file "backend/index.js"
check_file "backend/.env"
check_dir "backend/controllers"
check_dir "backend/models"
check_dir "backend/routes"
echo ""

echo "📄 Checking Documentation..."
check_file "README.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "VERCEL_DEPLOYMENT_FIX.md"
echo ""

echo "🔧 Checking Environment Variables..."
if [ -f "frontend/.env" ]; then
    if grep -q "REACT_APP_BASE_URL" frontend/.env; then
        echo -e "${GREEN}✓${NC} REACT_APP_BASE_URL is set in frontend/.env"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} REACT_APP_BASE_URL is missing in frontend/.env"
        ((CHECKS_FAILED++))
    fi
fi

if [ -f "backend/.env" ]; then
    if grep -q "MONGO_URL" backend/.env; then
        echo -e "${GREEN}✓${NC} MONGO_URL is set in backend/.env"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} MONGO_URL is missing in backend/.env"
        ((CHECKS_FAILED++))
    fi
fi
echo ""

echo "📦 Checking Dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd backend && npm install)"
fi
echo ""

echo "🔍 Checking Git Status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    ((CHECKS_PASSED++))
    
    # Check if there are uncommitted changes
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠${NC} You have uncommitted changes:"
        git status -s
        echo ""
        echo -e "${YELLOW}💡 Tip:${NC} Commit and push your changes before deploying:"
        echo "   git add ."
        echo "   git commit -m \"Prepare for deployment\""
        echo "   git push origin main"
    else
        echo -e "${GREEN}✓${NC} No uncommitted changes"
        ((CHECKS_PASSED++))
    fi
else
    echo -e "${RED}✗${NC} Not a git repository"
    ((CHECKS_FAILED++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo -e "${GREEN}✓ Passed:${NC} $CHECKS_PASSED"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}✗ Failed:${NC} $CHECKS_FAILED"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! You're ready to deploy.${NC}"
    echo ""
    echo "📚 Next Steps:"
    echo "1. Read DEPLOYMENT_GUIDE.md for detailed instructions"
    echo "2. Read VERCEL_DEPLOYMENT_FIX.md if you encounter 404 errors"
    echo "3. Deploy backend to Render: https://render.com"
    echo "4. Deploy frontend to Vercel: https://vercel.com"
    echo "5. Update environment variables on deployment platforms"
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above before deploying.${NC}"
fi
echo ""
