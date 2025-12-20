#!/bin/bash

# Validation script for deployment configurations
# This script validates Docker and configuration files without full deployment

set -e

echo "🔍 Validating Deployment Configurations..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Docker
echo "1. Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker found: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}✗ Docker not found. Please install Docker.${NC}"
    exit 1
fi

# Check Docker Compose
echo "2. Checking Docker Compose installation..."
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✓ Docker Compose found: $COMPOSE_VERSION${NC}"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose found: $COMPOSE_VERSION${NC}"
else
    echo -e "${RED}✗ Docker Compose not found. Please install Docker Compose.${NC}"
    exit 1
fi

# Validate docker-compose.yml
echo "3. Validating docker-compose.yml..."
if docker compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✓ docker-compose.yml is valid${NC}"
else
    echo -e "${RED}✗ docker-compose.yml has errors${NC}"
    exit 1
fi

echo "4. Validating docker-compose.prod.yml..."
if docker compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
    echo -e "${GREEN}✓ docker-compose.prod.yml is valid${NC}"
else
    echo -e "${RED}✗ docker-compose.prod.yml has errors${NC}"
    exit 1
fi

# Check required files
echo "5. Checking required files..."
files=(
    "backend/Dockerfile"
    "backend/.dockerignore"
    "backend/pom.xml"
    "frontend/Dockerfile"
    "frontend/.dockerignore"
    "frontend/nginx.conf"
    "frontend/package.json"
    "setup-mysql.sql"
    ".env.example"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file not found${NC}"
        exit 1
    fi
done

# Check .env file
echo "6. Checking environment configuration..."
if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found (will use .env.example defaults)${NC}"
fi

# Validate Dockerfile syntax (basic check)
echo "7. Checking Dockerfile files exist and are readable..."
if [ -r "backend/Dockerfile" ]; then
    echo -e "${GREEN}✓ Backend Dockerfile exists and is readable${NC}"
else
    echo -e "${RED}✗ Backend Dockerfile not found or not readable${NC}"
    exit 1
fi

if [ -r "frontend/Dockerfile" ]; then
    echo -e "${GREEN}✓ Frontend Dockerfile exists and is readable${NC}"
else
    echo -e "${RED}✗ Frontend Dockerfile not found or not readable${NC}"
    exit 1
fi

# Summary
echo ""
echo -e "${GREEN}✓ All validation checks passed!${NC}"
echo ""
echo "You can now deploy using:"
echo "  docker compose up -d --build"
echo ""
echo "Or use the deployment script:"
echo "  ./deploy.sh"
