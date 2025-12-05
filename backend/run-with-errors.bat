@echo off
echo ========================================
echo Running Backend with Full Error Output
echo ========================================
echo.

echo Cleaning previous build...
call mvn clean

echo.
echo Compiling project...
call mvn compile
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Compilation failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot...
echo Full error output will be shown below:
echo ========================================
echo.

call mvn spring-boot:run -e

echo.
echo ========================================
echo Backend stopped.
pause

