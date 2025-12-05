@echo off
echo ========================================
echo MySQL Database Setup for Coffee Shop
echo ========================================
echo.
echo This script will help you set up MySQL database.
echo.
echo Step 1: Make sure MySQL is running
echo Step 2: You'll need to enter your MySQL root password
echo Step 3: The database and user will be created
echo.
pause

echo.
echo Connecting to MySQL...
echo Please enter your MySQL root password when prompted:
echo.

mysql -u root -p < setup-mysql.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database setup completed!
    echo ========================================
    echo.
    echo Database: coffee_shop
    echo Username: coffee_admin
    echo Password: Coffee@123
    echo.
    echo You can now run the backend with:
    echo   cd backend
    echo   mvn spring-boot:run
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database setup failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is installed and running
    echo 2. MySQL is in your system PATH
    echo 3. You entered the correct root password
    echo.
    echo You can also set up manually by:
    echo 1. Opening MySQL Command Line Client
    echo 2. Running the commands in setup-mysql.sql
    echo.
)

pause

