#!/bin/bash

# Speech-to-Text Application Setup Script
# This script sets up both frontend and backend

echo "🚀 Setting up Speech-to-Text Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd server
npm install
echo "✅ Backend dependencies installed"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../client
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Return to root
cd ..

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy server/.env.example to server/.env and add your MongoDB URI and AssemblyAI API key"
echo "2. Copy client/.env.example to client/.env"
echo "3. Run 'npm run start-dev' from the root directory to start both servers"
echo ""
echo "🌐 Application will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
