#!/bin/bash

echo "🔧 Installing backend dependencies..."
cd server && npm install

echo "🔧 Installing frontend dependencies..."
cd ../client && npm install

echo "✅ All dependencies installed!"
echo ""
echo "📝 To run the project:"
echo "  Backend:  cd server && npm start"
echo "  Frontend: cd client && npm run dev"
