@echo off
echo ========================================
echo Starting Coffee Shop Backend
echo ========================================
echo.

cd backend

echo Building and starting backend...
echo This may take a minute...
echo.

mvn spring-boot:run

pause
