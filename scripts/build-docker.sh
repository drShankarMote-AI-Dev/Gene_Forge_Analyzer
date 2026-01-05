#!/bin/bash
# Docker build script for Gene Forge Analyzer

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Gene Forge Analyzer - Docker Build Script${NC}"
echo "================================================"
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# Build the image
echo -e "${BLUE}Building Docker image...${NC}"
docker build -t gene-forge-analyzer:latest -f docker/Dockerfile .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build successful!${NC}"
  echo ""
  echo "Available commands:"
  echo ""
  echo "Run container:"
  echo "  docker run -p 5173:5173 gene-forge-analyzer:latest"
  echo ""
  echo "Run with docker-compose:"
  echo "  docker-compose up -d"
  echo ""
else
  echo -e "${RED}✗ Build failed!${NC}"
  exit 1
fi
