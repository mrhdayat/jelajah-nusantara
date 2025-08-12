#!/bin/bash

# Troubleshooting script untuk demo IBM Jakarta

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check Docker status
check_docker() {
    print_header "CHECKING DOCKER"
    
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running"
        echo "Please start Docker Desktop and try again"
        exit 1
    fi
    print_success "Docker is running"
    
    # Check Docker Compose
    if ! docker-compose --version > /dev/null 2>&1; then
        print_error "Docker Compose not found"
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Check services status
check_services() {
    print_header "CHECKING SERVICES STATUS"
    
    # Check if containers are running
    if docker-compose -f docker-compose.demo.yml ps | grep -q "Up"; then
        print_success "Some services are running"
        docker-compose -f docker-compose.demo.yml ps
    else
        print_warning "No services are running"
        echo "Run: ./scripts/setup-demo.sh to start services"
    fi
}

# Check service health
check_health() {
    print_header "CHECKING SERVICE HEALTH"
    
    # Check backend
    print_info "Checking backend (http://localhost:8000)..."
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend is not responding"
        echo "Check logs: docker-compose -f docker-compose.demo.yml logs backend"
    fi
    
    # Check frontend
    print_info "Checking frontend (http://localhost:3000)..."
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not responding"
        echo "Check logs: docker-compose -f docker-compose.demo.yml logs frontend"
    fi
    
    # Check database
    print_info "Checking database..."
    if docker-compose -f docker-compose.demo.yml exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Database is healthy"
    else
        print_error "Database is not responding"
        echo "Check logs: docker-compose -f docker-compose.demo.yml logs postgres"
    fi
    
    # Check redis
    print_info "Checking Redis..."
    if docker-compose -f docker-compose.demo.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is healthy"
    else
        print_error "Redis is not responding"
        echo "Check logs: docker-compose -f docker-compose.demo.yml logs redis"
    fi
}

# Fix common issues
fix_issues() {
    print_header "FIXING COMMON ISSUES"
    
    echo "What issue are you experiencing?"
    echo "1. Services won't start"
    echo "2. Frontend not loading"
    echo "3. Backend API errors"
    echo "4. Database connection issues"
    echo "5. AI not responding"
    echo "6. Clean restart everything"
    echo "0. Exit"
    
    read -p "Choose option (0-6): " choice
    
    case $choice in
        1)
            print_info "Fixing service startup issues..."
            docker-compose -f docker-compose.demo.yml down
            docker system prune -f
            docker-compose -f docker-compose.demo.yml build --no-cache
            docker-compose -f docker-compose.demo.yml up -d
            ;;
        2)
            print_info "Fixing frontend issues..."
            docker-compose -f docker-compose.demo.yml restart frontend
            sleep 10
            print_info "Frontend should be available at http://localhost:3000"
            ;;
        3)
            print_info "Fixing backend issues..."
            docker-compose -f docker-compose.demo.yml restart backend
            sleep 10
            print_info "Backend should be available at http://localhost:8000"
            ;;
        4)
            print_info "Fixing database issues..."
            docker-compose -f docker-compose.demo.yml restart postgres
            sleep 15
            docker-compose -f docker-compose.demo.yml restart backend
            docker-compose -f docker-compose.demo.yml exec -T backend python scripts/init_db.py
            ;;
        5)
            print_info "Fixing AI issues..."
            print_warning "Setting AI provider to fallback mode..."
            sed -i.bak 's/AI_PROVIDER=.*/AI_PROVIDER=none/' backend/.env
            docker-compose -f docker-compose.demo.yml restart backend
            print_success "AI now using local fallback processing"
            ;;
        6)
            print_info "Clean restart everything..."
            docker-compose -f docker-compose.demo.yml down -v
            docker system prune -f
            docker volume prune -f
            print_success "Cleaned up. Run ./scripts/setup-demo.sh to restart"
            ;;
        0)
            exit 0
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Show logs
show_logs() {
    print_header "VIEWING LOGS"
    
    echo "Which logs do you want to see?"
    echo "1. All services"
    echo "2. Backend only"
    echo "3. Frontend only"
    echo "4. Database only"
    echo "5. Redis only"
    echo "0. Back to main menu"
    
    read -p "Choose option (0-5): " choice
    
    case $choice in
        1)
            docker-compose -f docker-compose.demo.yml logs -f
            ;;
        2)
            docker-compose -f docker-compose.demo.yml logs -f backend
            ;;
        3)
            docker-compose -f docker-compose.demo.yml logs -f frontend
            ;;
        4)
            docker-compose -f docker-compose.demo.yml logs -f postgres
            ;;
        5)
            docker-compose -f docker-compose.demo.yml logs -f redis
            ;;
        0)
            return
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Test demo functionality
test_demo() {
    print_header "TESTING DEMO FUNCTIONALITY"
    
    # Test backend API
    print_info "Testing backend API..."
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend API is working"
    else
        print_error "Backend API is not working"
        return 1
    fi
    
    # Test API docs
    print_info "Testing API documentation..."
    if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
        print_success "API docs are accessible"
    else
        print_error "API docs are not accessible"
    fi
    
    # Test frontend
    print_info "Testing frontend..."
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is working"
    else
        print_error "Frontend is not working"
        return 1
    fi
    
    print_success "Demo functionality test completed!"
    echo ""
    echo "🎯 Demo URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
}

# Main menu
main_menu() {
    while true; do
        print_header "DEMO TROUBLESHOOTING MENU"
        echo "1. Check Docker status"
        echo "2. Check services status"
        echo "3. Check service health"
        echo "4. Fix common issues"
        echo "5. Show logs"
        echo "6. Test demo functionality"
        echo "7. Quick restart all services"
        echo "0. Exit"
        echo ""
        
        read -p "Choose option (0-7): " choice
        
        case $choice in
            1)
                check_docker
                ;;
            2)
                check_services
                ;;
            3)
                check_health
                ;;
            4)
                fix_issues
                ;;
            5)
                show_logs
                ;;
            6)
                test_demo
                ;;
            7)
                print_info "Restarting all services..."
                docker-compose -f docker-compose.demo.yml restart
                sleep 20
                check_health
                ;;
            0)
                print_success "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 0-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
        echo ""
    done
}

# Run main menu
main_menu
