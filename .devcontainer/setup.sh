#!/bin/bash

echo "🚀 Starting Bodigi Loop Build in Codespaces..."

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "📝 Creating .env from .env.example"
        cp .env.example .env
    else
        echo "⚠️  No .env.example found. You'll need to create .env manually with your environment variables."
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✨ Bodigi Loop Build setup complete!"
echo ""
echo "🌐 Available commands:"
echo "  npm run dev          - Start both frontend and backend"
echo "  npm run dev:client   - Start frontend only (Vite on port 5173)"
echo "  npm run dev:server   - Start backend only (Express on port 5000)"
echo ""
echo "🔗 Once running, the frontend will be available at the forwarded port 5173"
echo "🔗 The backend API will be available at the forwarded port 5000"
echo ""
echo "⚡ To start development, run: npm run dev"