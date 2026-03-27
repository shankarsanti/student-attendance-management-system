#!/bin/bash

echo "================================"
echo "Backend Deployment to Vercel"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed!"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Navigate to backend directory
cd backend || exit

echo "📦 Deploying to Vercel..."
echo ""

# Deploy to production
vercel --prod

echo ""
echo "================================"
echo "Deployment Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Verify environment variables in Vercel dashboard"
echo "2. Test the backend: curl https://student-attendance-management-syste-nu.vercel.app/health"
echo "3. Deploy frontend to Netlify"
echo ""
echo "Required Environment Variables in Vercel:"
echo "  - MONGO_URL"
echo "  - JWT_SECRET"
echo "  - SECRET_KEY"
echo "  - FRONTEND_URL"
echo "  - NODE_ENV=production"
