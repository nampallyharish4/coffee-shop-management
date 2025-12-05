# Simple Setup - Coffee Shop Management System

## Current Situation

You have:
- ✅ Java 22 installed
- ✅ Node.js 23.5.0 installed

You need:
- ❌ Maven (for building backend)
- ❌ MySQL (or use H2 alternative)

## Option 1: Quick Test with H2 (Recommended for Testing)

### Install Maven First

**Easiest Method - Using Chocolatey:**
```cmd
choco install maven
```

**Manual Method:**
1. Download: https://maven.apache.org/download.cgi
2. Get "apache-maven-3.9.x-bin.zip"
3. Extract to: C:\maven
4. Add to PATH: C:\maven\bin
5. Restart Command Prompt
6. Verify: `mvn -version`

### Run the Project

**Terminal 1 - Backend:**
```cmd
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm install
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- H2 Console: http://localhost:8080/h2-console
- Swagger: http://localhost:8080/swagger-ui.html

### Login
- Email: admin@coffeeshop.com
- Password: Admin@123

## Option 2: Full Setup with MySQL

### 1. Install MySQL
Download from: https://dev.mysql.com/downloads/installer/

### 2. Create Database
```sql
CREATE DATABASE coffee_shop;
CREATE USER 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Install Maven
(Same as Option 1)

### 4. Run Backend
```cmd
cd backend
mvn spring-boot:run
```

### 5. Run Frontend
```cmd
cd frontend
npm install
npm start
```

## Option 3: Use Pre-built JAR (If Available)

If someone provides a pre-built JAR file:

```cmd
java -jar coffee-shop-backend-1.0.0.jar --spring.profiles.active=h2
```

## What is H2?

H2 is an in-memory database that:
- ✅ Requires no installation
- ✅ Starts automatically with the app
- ✅ Perfect for testing
- ❌ Data is lost when app stops
- ❌ Not for production use

## What is Maven?

Maven is a build tool that:
- Downloads dependencies (libraries)
- Compiles Java code
- Packages the application
- Runs the application

## Minimum Steps to Run

1. **Install Maven** (5 minutes)
   - Download and extract
   - Add to PATH
   - Restart terminal

2. **Start Backend** (2 minutes first time, 30 seconds after)
   ```cmd
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=h2
   ```

3. **Start Frontend** (2 minutes first time, 10 seconds after)
   ```cmd
   cd frontend
   npm install
   npm start
   ```

4. **Open Browser**
   - Go to: http://localhost:3000
   - Login: admin@coffeeshop.com / Admin@123

## Troubleshooting

### "mvn is not recognized"
- Maven not installed or not in PATH
- Restart Command Prompt after installation
- Verify with: `mvn -version`

### Backend fails to start
- Check if port 8080 is free
- Read error message carefully
- Ensure Java 17+ is installed

### Frontend fails to start
- Check if port 3000 is free
- Delete node_modules and run `npm install` again
- Ensure Node.js is installed

### Can't connect to backend
- Ensure backend is running (check Terminal 1)
- Check http://localhost:8080/swagger-ui.html
- Verify no firewall blocking

## Quick Commands Reference

```cmd
# Check installations
java -version
node -v
npm -v
mvn -version

# Backend (with H2)
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2

# Backend (with MySQL)
cd backend
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm start

# Build for production
cd backend
mvn clean package -DskipTests

cd frontend
npm run build
```

## Next Steps After Running

1. Login as Admin
2. Explore the Dashboard
3. Try creating an order in POS
4. Check Barista View
5. Manage Inventory
6. View Analytics

## Need Help?

1. Read INSTALLATION_STEPS.md for detailed instructions
2. Check error messages in terminal
3. Verify all prerequisites are installed
4. Ensure ports 3000 and 8080 are available

## Production Deployment

For production:
1. Install MySQL (not H2)
2. Build backend: `mvn clean package`
3. Build frontend: `npm run build`
4. Deploy JAR file and build folder
5. Configure production database
6. Use environment variables for secrets
