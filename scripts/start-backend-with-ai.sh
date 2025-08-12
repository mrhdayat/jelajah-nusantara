#!/bin/bash

# Start Backend with AI Providers for IBM Jakarta Demo
# Supports: IBM Watson Orchestrate, Replicate (IBM Granite), Hugging Face

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "================================"
echo "BACKEND AI PROVIDERS - IBM DEMO"
echo "================================"

# Check if we're in the right directory
if [ ! -f "backend/requirements.txt" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check environment file
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found"
    if [ -f "backend/.env.demo" ]; then
        print_info "Copying from .env.demo..."
        cp backend/.env.demo backend/.env
        print_success "Environment file created"
    else
        print_error "No environment file found. Please run setup-demo.sh first"
        exit 1
    fi
fi

# Check AI provider configuration
print_info "Checking AI provider configuration..."

AI_PROVIDER=$(grep "^AI_PROVIDER=" backend/.env | cut -d'=' -f2 || echo "")
IBM_WATSON_KEY=$(grep "^IBM_WATSON_API_KEY=" backend/.env | cut -d'=' -f2 || echo "")
REPLICATE_TOKEN=$(grep "^REPLICATE_API_TOKEN=" backend/.env | cut -d'=' -f2 || echo "")
HUGGINGFACE_TOKEN=$(grep "^HUGGINGFACE_API_TOKEN=" backend/.env | cut -d'=' -f2 || echo "")

echo ""
print_info "AI Provider Configuration:"
echo "  Primary Provider: ${AI_PROVIDER:-not_set}"
echo "  IBM Watson: ${IBM_WATSON_KEY:+✅ Configured}${IBM_WATSON_KEY:-❌ Not configured}"
echo "  Replicate: ${REPLICATE_TOKEN:+✅ Configured}${REPLICATE_TOKEN:-❌ Not configured}"
echo "  Hugging Face: ${HUGGINGFACE_TOKEN:+✅ Configured}${HUGGINGFACE_TOKEN:-❌ Not configured}"
echo ""

# Check if at least one AI provider is configured
if [ -z "$IBM_WATSON_KEY" ] && [ -z "$REPLICATE_TOKEN" ] && [ -z "$HUGGINGFACE_TOKEN" ]; then
    print_warning "No AI providers configured. Backend will use mock data only."
    echo ""
    echo "To configure AI providers:"
    echo "1. IBM Watson: Add IBM_WATSON_API_KEY to backend/.env"
    echo "2. Replicate: Add REPLICATE_API_TOKEN to backend/.env"
    echo "3. Hugging Face: Add HUGGINGFACE_API_TOKEN to backend/.env"
    echo ""
    read -p "Continue with mock data only? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check Python and virtual environment
print_info "Setting up Python environment..."

cd backend

if [ ! -d "venv" ]; then
    print_info "Creating virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
fi

print_info "Activating virtual environment..."
source venv/bin/activate

print_info "Installing dependencies..."
pip install -r requirements.txt

print_success "Dependencies installed"

# Check database connection
print_info "Checking database connection..."
if python -c "
import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv('DATABASE_URL')
if db_url:
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            conn.execute('SELECT 1')
        print('✅ Database connection successful')
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        exit(1)
else:
    print('❌ DATABASE_URL not found in environment')
    exit(1)
"; then
    print_success "Database connection verified"
else
    print_error "Database connection failed"
    exit 1
fi

# Start the backend server
print_info "Starting backend server with AI providers..."
echo ""
print_info "Backend will be available at: http://localhost:8000"
print_info "API docs will be available at: http://localhost:8000/docs"
print_info "Health check: http://localhost:8000/health"
echo ""

# Show AI provider priority
print_info "AI Provider Priority for IBM Demo:"
echo "  1. 🔵 IBM Watson Orchestrate (Primary)"
echo "  2. 🟡 Replicate IBM Granite (Backup)"
echo "  3. 🟢 Hugging Face (Fallback)"
echo "  4. 🔴 Mock Data (Final fallback)"
echo ""

print_info "Starting server..."
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
