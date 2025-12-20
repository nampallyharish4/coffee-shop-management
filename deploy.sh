#!/bin/bash

# Coffee Shop Management System - Deployment Script
# This script helps deploy the application using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}☕ Coffee Shop Management System - Deployment Script${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Use docker compose (new) or docker-compose (old)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Check if .env file exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file. Please review and update it with your configuration.${NC}"
fi

# Function to display menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1) Start all services (build & run)"
    echo "2) Start all services (without rebuild)"
    echo "3) Stop all services"
    echo "4) Restart all services"
    echo "5) View logs"
    echo "6) Clean up (stop & remove containers, volumes, images)"
    echo "7) Check service status"
    echo "8) Exit"
    echo ""
}

# Function to start services with build
start_with_build() {
    echo -e "${GREEN}Building and starting all services...${NC}"
    $DOCKER_COMPOSE up -d --build
    echo ""
    echo -e "${GREEN}✓ Services started successfully!${NC}"
    echo ""
    echo "Access the application:"
    echo "  - Frontend: http://localhost:80"
    echo "  - Backend API: http://localhost:8081"
    echo "  - Swagger UI: http://localhost:8081/swagger-ui.html"
    echo ""
}

# Function to start services without build
start_services() {
    echo -e "${GREEN}Starting all services...${NC}"
    $DOCKER_COMPOSE up -d
    echo ""
    echo -e "${GREEN}✓ Services started successfully!${NC}"
    echo ""
    echo "Access the application:"
    echo "  - Frontend: http://localhost:80"
    echo "  - Backend API: http://localhost:8081"
    echo "  - Swagger UI: http://localhost:8081/swagger-ui.html"
    echo ""
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    $DOCKER_COMPOSE down
    echo -e "${GREEN}✓ Services stopped successfully!${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting all services...${NC}"
    $DOCKER_COMPOSE restart
    echo -e "${GREEN}✓ Services restarted successfully!${NC}"
}

# Function to view logs
view_logs() {
    echo "Select service to view logs:"
    echo "1) All services"
    echo "2) Backend"
    echo "3) Frontend"
    echo "4) Database"
    read -p "Enter choice [1-4]: " log_choice
    
    case $log_choice in
        1) $DOCKER_COMPOSE logs -f ;;
        2) $DOCKER_COMPOSE logs -f backend ;;
        3) $DOCKER_COMPOSE logs -f frontend ;;
        4) $DOCKER_COMPOSE logs -f database ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
}

# Function to clean up
cleanup() {
    echo -e "${RED}WARNING: This will remove all containers, volumes, and images.${NC}"
    read -p "Are you sure? (y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo -e "${YELLOW}Cleaning up...${NC}"
        $DOCKER_COMPOSE down -v --rmi all
        echo -e "${GREEN}✓ Cleanup completed!${NC}"
    else
        echo "Cleanup cancelled."
    fi
}

# Function to check status
check_status() {
    echo -e "${GREEN}Service Status:${NC}"
    $DOCKER_COMPOSE ps
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice [1-8]: " choice
    
    case $choice in
        1) start_with_build ;;
        2) start_services ;;
        3) stop_services ;;
        4) restart_services ;;
        5) view_logs ;;
        6) cleanup ;;
        7) check_status ;;
        8) echo "Exiting..."; exit 0 ;;
        *) echo -e "${RED}Invalid option. Please try again.${NC}" ;;
    esac
    
    # Pause before showing menu again
    read -p "Press Enter to continue..."
done
