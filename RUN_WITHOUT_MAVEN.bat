@echo off
echo ========================================
echo Coffee Shop Management System
echo Running with H2 Database (No MySQL needed)
echo ========================================
echo.
echo IMPORTANT: This requires Maven to be installed.
echo.
echo If you don't have Maven, please:
echo 1. Download from: https://maven.apache.org/download.cgi
echo 2. Or use Chocolatey: choco install maven
echo.
echo Alternatively, download the pre-built JAR file.
echo.
pause
echo.
echo Starting backend...
cd backend
call mvn spring-boot:run -Dspring-boot.run.profiles=h2
