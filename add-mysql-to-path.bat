@echo off
echo ========================================
echo Add MySQL to Windows PATH
echo ========================================
echo.
echo This script will add MySQL to your system PATH.
echo You need to run this as Administrator!
echo.
pause

set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin"

echo.
echo Checking if MySQL path exists...
if exist "%MYSQL_PATH%\mysql.exe" (
    echo [OK] MySQL found at: %MYSQL_PATH%
) else (
    echo [ERROR] MySQL not found at: %MYSQL_PATH%
    echo Please check your MySQL installation path.
    pause
    exit /b 1
)

echo.
echo Checking if already in PATH...
echo %PATH% | findstr /C:"%MYSQL_PATH%" >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] MySQL is already in PATH!
    pause
    exit /b 0
)

echo.
echo Adding MySQL to PATH...
setx PATH "%PATH%;%MYSQL_PATH%" /M

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! MySQL added to PATH!
    echo ========================================
    echo.
    echo IMPORTANT: Close and reopen Command Prompt for changes to take effect.
    echo.
    echo After reopening, test with: mysql --version
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to add MySQL to PATH
    echo ========================================
    echo.
    echo Make sure you're running this as Administrator!
    echo Right-click this file and select "Run as administrator"
    echo.
)

pause

