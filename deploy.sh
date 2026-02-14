#!/bin/bash

# Zepika Clone - Netlify Deployment Script
# This script builds and deploys the project to Netlify

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

# Run build
echo "🏗️  Building the project..."
bun run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo "❌ Build failed: .next directory not found"
    exit 1
fi

echo "✅ Build successful!"

# Check if Netlify CLI is available
if ! command -v netlify &> /dev/null; then
    echo "📥 Netlify CLI not found. Installing..."
    bunx netlify --version
fi

# Deploy
echo "🌐 Deploying to Netlify..."
echo ""
echo "Choose deployment type:"
echo "1) Production deploy"
echo "2) Draft deploy (preview)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "Deploying to production..."
        bunx netlify deploy --prod
        ;;
    2)
        echo "Creating draft deploy..."
        bunx netlify deploy
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
