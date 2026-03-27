#!/bin/bash

echo "🚀 Pushing to GitHub"
echo "===================="
echo ""

# Add all changes
echo "📦 Adding all changes..."
git add .

# Show status
echo ""
echo "📋 Files to be committed:"
git status --short

echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update: Fixed build errors, cleaned up files, renamed to Student Management System"
fi

echo ""
echo "💾 Committing changes..."
git commit -m "$commit_msg"

echo ""
echo "🔄 Pushing to GitHub..."
git push student-repo main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Your repository:"
    echo "   https://github.com/shankarsanti/student-attendance-management-system"
    echo ""
else
    echo ""
    echo "❌ Push failed. You may need to pull first:"
    echo "   git pull student-repo main --rebase"
    echo "   git push student-repo main"
fi
