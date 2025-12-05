@echo off
echo ========================================
echo Coffee Shop Project Status Checker
echo ========================================
echo.

echo Checking Backend (Port 8080)...
netstat -ano | findstr ":8080" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend is running on port 8080
    echo Testing backend...
    curl -s http://localhost:8080/api/auth/test 2>nul | findstr /C:"error" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo [OK] Backend is responding
    ) else (
        echo [WARN] Backend may have errors
    )
) else (
    echo [ERROR] Backend is NOT running on port 8080
    echo Check backend logs for errors
)

echo.
echo Checking Frontend (Port 3000)...
netstat -ano | findstr ":3000" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend is running on port 3000
    echo Open: http://localhost:3000
) else (
    echo [WARN] Frontend is NOT running on port 3000
    echo Frontend may still be compiling...
)

echo.
echo Checking Processes...
tasklist | findstr /I "java.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Java process (Backend) is running
) else (
    echo [ERROR] Java process not found
)

tasklist | findstr /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node process (Frontend) is running
) else (
    echo [ERROR] Node process not found
)

echo.
echo ========================================
echo Access URLs:
echo ========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080/api
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.
echo Default Login:
echo Email: admin@coffeeshop.com
echo Password: Admin@123
echo.
echo ========================================
pause

