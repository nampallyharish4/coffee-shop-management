@echo off
echo ========================================
echo Fixing Coffee Shop Backend
echo ========================================
echo.

echo Step 1: Checking MySQL service...
sc query MySQL80 | findstr "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL service is running
) else (
    echo [ERROR] MySQL service is not running!
    echo Starting MySQL service...
    net start MySQL80
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to start MySQL. Please start it manually.
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Stopping any existing backend processes...
tasklist | findstr /I "java.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo Stopping existing Java processes...
    taskkill /F /IM java.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo.
echo Step 3: Checking MySQL connection...
echo Note: You may need to set up database and user first.
echo.
echo IMPORTANT: Make sure you have run setup-mysql.sql in MySQL!
echo If not, do this:
echo 1. Open MySQL Command Line Client or MySQL Workbench
echo 2. Run the commands from setup-mysql.sql
echo 3. Or run: mysql -u root -p ^< setup-mysql.sql
echo.

echo Step 4: Starting backend...
echo This will show detailed error messages if something fails.
echo.
cd backend

echo Building project...
call mvn clean compile -q
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo If you see MySQL connection errors, make sure:
echo - Database 'coffee_shop' exists
echo - User 'coffee_admin' exists with password 'Coffee@123'
echo - User has proper privileges
echo.
mvn spring-boot:run

pause

