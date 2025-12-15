@echo off
if not exist "target\coffee-shop-backend-1.0.0.jar" (
    echo [ERROR] JAR file not found. Run 'mvn clean package' first.
    pause
    exit /b 1
)
java -jar target\coffee-shop-backend-1.0.0.jar
