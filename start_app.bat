@echo off
echo ==============================================
echo Starting Coffee Shop Management System
echo ==============================================

echo 1. Launching Backend (Spring Boot)...
start "Coffee Shop Backend" cmd /c "start-backend.bat"

echo 2. Launching Frontend (React)...
start "Coffee Shop Frontend" cmd /c "start-frontend.bat"

echo.
echo Both services are starting in separate windows.
echo Please inspect those windows for any errors.
echo.
echo Once started:
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
pause
