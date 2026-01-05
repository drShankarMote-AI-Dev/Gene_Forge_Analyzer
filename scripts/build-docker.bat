@echo off
REM Docker build script for Gene Forge Analyzer (Windows)
REM Organized structure update

echo.
echo ===============================================
echo    Gene Forge Analyzer - Docker Build Script
echo ===============================================
echo.

REM Navigate to project root (one level up from scripts/)
cd /d "%~dp0.."

echo Building Docker image from project root...
echo Context: %CD%
echo.

docker build -t gene-forge-analyzer:latest -f docker/Dockerfile .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Build successful!
    echo.
    echo Available commands (run from project root):
    echo.
    echo Run container:
    echo   docker run -p 5173:5173 gene-forge-analyzer:latest
    echo.
    echo Run with docker-compose:
    echo   docker-compose up -d
    echo.
) else (
    echo ✗ Build failed!
    exit /b 1
)
