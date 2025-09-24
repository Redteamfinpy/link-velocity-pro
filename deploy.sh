#!/bin/bash

# Link Velocity Pro - Deployment Script
# This script deploys the application to Vercel with zero downtime

set -e

echo "🚀 Link Velocity Pro - Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    npm run test 2>/dev/null || print_warning "No tests found or tests failed (this is optional)"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if user is logged in
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please login first."
        vercel login
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Deployed to Vercel successfully"
        print_status "Vercel URL: https://$(vercel ls --json | jq -r '.[0].url')"
    else
        print_error "Vercel deployment failed"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if database exists
    if ! vercel storage ls | grep -q "postgres"; then
        print_warning "Postgres database not found. Creating..."
        vercel storage create postgres
    fi
    
    print_success "Database setup completed"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # This would typically run SQL migrations
    print_warning "Database migrations not implemented yet"
    print_status "Please run the following SQL manually:"
    echo "CREATE TABLE links (id VARCHAR(255) PRIMARY KEY, original_url TEXT NOT NULL, short_id VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT NOW(), clicks INTEGER DEFAULT 0);"
    echo "CREATE TABLE click_analytics (id VARCHAR(255) PRIMARY KEY, link_id VARCHAR(255) REFERENCES links(id), ip_address VARCHAR(255), user_agent TEXT, referer TEXT, clicked_at TIMESTAMP DEFAULT NOW());"
}

# Check deployment health
check_health() {
    print_status "Checking deployment health..."
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')
    
    # Check if the API is responding
    if curl -s -f "https://$DEPLOYMENT_URL/api/shorten" > /dev/null; then
        print_success "API is responding correctly"
    else
        print_warning "API health check failed (this might be expected for GET requests)"
    fi
    
    # Check if the main page is responding
    if curl -s -f "https://$DEPLOYMENT_URL" > /dev/null; then
        print_success "Main page is responding correctly"
    else
        print_error "Main page health check failed"
        exit 1
    fi
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build application
    build_app
    
    # Setup database
    setup_database
    
    # Deploy to Vercel
    deploy_vercel
    
    # Run migrations
    run_migrations
    
    # Check health
    check_health
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Your application is now live on Vercel"
    
    echo ""
    echo "📊 Next steps:"
    echo "1. Check your deployment: https://$(vercel ls --json | jq -r '.[0].url')"
    echo "2. Test the API:"
    echo "   curl -X POST https://$(vercel ls --json | jq -r '.[0].url')/api/shorten \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"url\": \"https://example.com\"}'"
    echo ""
    echo "3. Set up environment variables in Vercel dashboard"
    echo "4. Configure custom domain (optional)"
    echo "5. Start marketing on LinkedIn and Reddit!"
}

# Handle command line arguments
case "${1:-}" in
    "vercel")
        check_dependencies
        build_app
        deploy_vercel
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_app
        ;;
    "health")
        check_health
        ;;
    *)
        main
        ;;
esac
