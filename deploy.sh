#!/bin/bash

echo "🚀 Deploying Priya Fresh Meat Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI found"
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo "📱 Your API is now live on Vercel!"
echo "🔗 Check the URL above for your live API endpoints"
