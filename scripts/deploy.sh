#!/bin/bash

# Jelajah Nusantara AI Deployment Script
# This script handles deployment to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
SKIP_TESTS=false
SKIP_BUILD=false
BACKUP_DB=true

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Deployment environment (development|staging|production)"
    echo "  -s, --skip-tests        Skip running tests"
    echo "  -b, --skip-build        Skip building Docker images"
    echo "  -n, --no-backup         Skip database backup"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -e production"
    echo "  $0 --environment staging --skip-tests"
    echo "  $0 -e development --skip-build"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -b|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -n|--no-backup)
            BACKUP_DB=false
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_error "Valid environments: development, staging, production"
    exit 1
fi

print_status "Starting deployment to $ENVIRONMENT environment..."

# Check if required files exist
check_requirements() {
    print_status "Checking requirements..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi
    
    if [ ! -f "backend/.env" ] && [ "$ENVIRONMENT" != "development" ]; then
        print_error "backend/.env not found. Copy from .env.example and configure."
        exit 1
    fi
    
    if [ ! -f "frontend/.env.local" ] && [ "$ENVIRONMENT" != "development" ]; then
        print_error "frontend/.env.local not found. Copy from .env.example and configure."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        print_warning "Skipping tests"
        return
    fi
    
    print_status "Running tests..."
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    if [ -f "requirements.txt" ]; then
        python -m pytest tests/ -v
    else
        print_warning "No backend tests found"
    fi
    cd ..
    
    # Frontend tests
    print_status "Running frontend tests..."
    cd frontend
    if [ -f "package.json" ]; then
        npm test -- --watchAll=false
    else
        print_warning "No frontend tests found"
    fi
    cd ..
    
    print_success "Tests completed"
}

# Backup database
backup_database() {
    if [ "$BACKUP_DB" = false ] || [ "$ENVIRONMENT" = "development" ]; then
        print_warning "Skipping database backup"
        return
    fi
    
    print_status "Creating database backup..."
    
    BACKUP_DIR="backups"
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_${ENVIRONMENT}_${TIMESTAMP}.sql"
    
    # Get database URL from environment
    if [ -f "backend/.env" ]; then
        DATABASE_URL=$(grep "^DATABASE_URL=" backend/.env | cut -d '=' -f2-)
        if [ ! -z "$DATABASE_URL" ]; then
            pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
            print_success "Database backup created: $BACKUP_FILE"
        else
            print_warning "DATABASE_URL not found in backend/.env"
        fi
    fi
}

# Build Docker images
build_images() {
    if [ "$SKIP_BUILD" = true ]; then
        print_warning "Skipping Docker build"
        return
    fi
    
    print_status "Building Docker images..."
    
    # Choose the right docker-compose file
    COMPOSE_FILE="docker-compose.yml"
    if [ "$ENVIRONMENT" = "production" ]; then
        COMPOSE_FILE="docker-compose.prod.yml"
    elif [ "$ENVIRONMENT" = "staging" ]; then
        COMPOSE_FILE="docker-compose.staging.yml"
    fi
    
    if [ -f "$COMPOSE_FILE" ]; then
        docker-compose -f "$COMPOSE_FILE" build --no-cache
    else
        docker-compose build --no-cache
    fi
    
    print_success "Docker images built successfully"
}

# Deploy services
deploy_services() {
    print_status "Deploying services..."
    
    # Choose the right docker-compose file
    COMPOSE_FILE="docker-compose.yml"
    if [ "$ENVIRONMENT" = "production" ]; then
        COMPOSE_FILE="docker-compose.prod.yml"
    elif [ "$ENVIRONMENT" = "staging" ]; then
        COMPOSE_FILE="docker-compose.staging.yml"
    fi
    
    # Stop existing services
    if [ -f "$COMPOSE_FILE" ]; then
        docker-compose -f "$COMPOSE_FILE" down
    else
        docker-compose down
    fi
    
    # Start services
    if [ -f "$COMPOSE_FILE" ]; then
        docker-compose -f "$COMPOSE_FILE" up -d
    else
        docker-compose up -d
    fi
    
    print_success "Services deployed successfully"
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run database initialization
    docker-compose exec backend python scripts/init_db.py
    
    print_success "Database initialized"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend health check passed"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend health check passed"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    print_success "All health checks passed"
}

# Cleanup old images
cleanup() {
    print_status "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old images (keep last 3 versions)
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | \
    grep "jelajah" | \
    tail -n +4 | \
    awk '{print $3}' | \
    xargs -r docker rmi
    
    print_success "Cleanup completed"
}

# Main deployment flow
main() {
    print_status "=== Jelajah Nusantara AI Deployment ==="
    print_status "Environment: $ENVIRONMENT"
    print_status "Skip tests: $SKIP_TESTS"
    print_status "Skip build: $SKIP_BUILD"
    print_status "Backup DB: $BACKUP_DB"
    echo ""
    
    check_requirements
    run_tests
    backup_database
    build_images
    deploy_services
    init_database
    health_check
    cleanup
    
    print_success "=== Deployment completed successfully! ==="
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "API Docs: http://localhost:8000/docs"
}

# Run main function
main
