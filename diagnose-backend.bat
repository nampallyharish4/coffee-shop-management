@echo off
echo ========================================
echo Backend Diagnostic Tool
echo ========================================
echo.

echo Step 1: Checking Java installation...
java -version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] Java is installed
echo.

echo Step 2: Checking Maven installation...
mvn -version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] Maven is installed
echo.

echo Step 3: Checking MySQL service...
sc query MySQL80 | findstr "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL service is running
) else (
    echo [WARN] MySQL service is not running
    echo Attempting to start MySQL...
    net start MySQL80
)
echo.

echo Step 4: Testing MySQL connection...
echo This will test if MySQL is accessible on port 3306
netstat -ano | findstr ":3306" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL is listening on port 3306
) else (
    echo [WARN] MySQL may not be listening on port 3306
)
echo.

echo Step 5: Cleaning previous build...
cd backend
call mvn clean
echo.

echo Step 6: Compiling project...
call mvn compile
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] ========================================
    echo COMPILATION FAILED!
    echo ========================================
    echo Check the errors above for compilation issues.
    pause
    exit /b 1
)
echo [OK] Compilation successful
echo.

echo Step 7: Testing with H2 Database (no MySQL needed)...
echo This will start backend with H2 in-memory database.
echo If this works, the issue is MySQL configuration.
echo.
set /p choice="Start with H2 database? (Y/N): "
if /i "%choice%"=="Y" (
    echo Starting backend with H2...
    call mvn spring-boot:run -Dspring-boot.run.profiles=h2
) else (
    echo.
    echo Step 8: Starting backend with MySQL...
    echo If this fails, check MySQL setup:
    echo 1. Database 'coffee_shop' exists
    echo 2. User 'coffee_admin' exists with password 'Coffee@123'
    echo 3. User has proper privileges
    echo.
    call mvn spring-boot:run
)

pause

