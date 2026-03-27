#!/bin/bash

echo "🚀 Simple Netlify Deployment"
echo "============================="
echo ""

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "📍 Script location: $SCRIPT_DIR"
echo ""

# Navigate to frontend from script location
cd "$SCRIPT_DIR/frontend" || {
    echo "❌ Error: Cannot find frontend folder!"
    echo "Expected location: $SCRIPT_DIR/frontend"
    exit 1
}

echo "✅ Found frontend folder"
echo "📁 Current location: $(pwd)"
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "✅ BUILD SUCCESSFUL!"
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo "📁 Build folder location:"
    echo "   $SCRIPT_DIR/frontend/build"
    echo ""
    echo "🎯 NEXT STEPS:"
    echo ""
    echo "1. Open Netlify in your browser:"
    echo "   https://app.netlify.com"
    echo ""
    echo "2. Click: 'Add new site' → 'Deploy manually'"
    echo ""
    echo "3. Drag and drop this folder:"
    echo "   $SCRIPT_DIR/frontend/build"
    echo ""
    echo "4. Your site will be live in seconds! 🎉"
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo "💡 TIP: You can also open the build folder with:"
    echo "   open $SCRIPT_DIR/frontend/build"
    echo ""
else
    echo ""
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
