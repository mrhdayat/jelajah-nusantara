#!/bin/bash

# Jelajah Nusantara AI - Development Setup Script
# This script sets up the development environment for both frontend and backend

set -e

echo "🚀 Setting up Jelajah Nusantara AI Development Environment"
echo "========================================================="

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.11+ from https://python.org/"
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
    if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 11) else 1)" 2>/dev/null; then
        echo "❌ Python 3.11+ is required. Current version: $(python3 --version)"
        exit 1
    fi
    
    echo "✅ Requirements check passed"
}

# Setup backend
setup_backend() {
    echo "🐍 Setting up Python backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating backend .env file..."
        cp .env.example .env
        echo "⚠️  Please edit backend/.env with your API keys and configuration"
    fi
    
    cd ..
    echo "✅ Backend setup completed"
}

# Setup frontend
setup_frontend() {
    echo "⚛️  Setting up Next.js frontend..."
    
    cd frontend
    
    # Install dependencies
    echo "Installing Node.js dependencies..."
    npm install
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env.local" ]; then
        echo "Creating frontend .env.local file..."
        cp .env.example .env.local
        echo "⚠️  Please edit frontend/.env.local with your API keys"
    fi
    
    cd ..
    echo "✅ Frontend setup completed"
}

# Setup database (optional)
setup_database() {
    echo "🗄️  Database setup..."
    
    if command -v docker &> /dev/null; then
        echo "Docker detected. You can use docker-compose to run PostgreSQL and Redis:"
        echo "  docker-compose up -d postgres redis"
    else
        echo "⚠️  Docker not found. Please install PostgreSQL and Redis manually or:"
        echo "  - Use Supabase (https://supabase.com) for PostgreSQL"
        echo "  - Use Redis Cloud (https://redis.com) for Redis"
        echo "  - Update DATABASE_URL and REDIS_URL in backend/.env"
    fi
}

# Create necessary directories
create_directories() {
    echo "📁 Creating project directories..."
    
    # Backend directories
    mkdir -p backend/app/api/routes
    mkdir -p backend/app/services
    mkdir -p backend/app/utils
    mkdir -p backend/tests
    
    # Frontend directories
    mkdir -p frontend/src/components/ui
    mkdir -p frontend/src/components/features
    mkdir -p frontend/src/hooks
    mkdir -p frontend/src/services
    
    # Documentation
    mkdir -p docs/api
    mkdir -p docs/deployment
    
    echo "✅ Directories created"
}

# Main setup function
main() {
    check_requirements
    create_directories
    setup_backend
    setup_frontend
    setup_database
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit backend/.env with your API keys (IBM Watsonx, Google Maps, etc.)"
    echo "2. Edit frontend/.env.local with your API keys"
    echo "3. Start the development servers:"
    echo ""
    echo "   # Terminal 1 - Backend"
    echo "   cd backend"
    echo "   source venv/bin/activate"
    echo "   uvicorn main:app --reload --port 8000"
    echo ""
    echo "   # Terminal 2 - Frontend"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "4. Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 Documentation: Check the README.md for more details"
    echo "🐛 Issues: Report bugs on GitHub"
    echo ""
}

# Run main function
main
