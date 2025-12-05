# Installation Steps for Windows

## Current Status ✅❌

- ✅ Java 22 installed
- ✅ Node.js 23.5.0 installed
- ❌ MySQL not installed
- ❌ Maven not installed

## Step 1: Install MySQL (Required)

### Option A: MySQL Installer (Recommended)
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Choose "mysql-installer-community-8.0.x.msi"
3. Run the installer
4. Select "Developer Default" setup type
5. Click "Execute" to install
6. Configure MySQL Server:
   - Choose "Standalone MySQL Server"
   - Port: 3306 (default)
   - Set root password (remember this!)
7. Complete the installation

### Option B: MySQL ZIP Archive
1. Download MySQL ZIP from: https://dev.mysql.com/downloads/mysql/
2. Extract to C:\mysql
3. Add C:\mysql\bin to System PATH
4. Initialize: `mysqld --initialize-insecure`
5. Start service: `mysqld --console`

### After MySQL Installation
Open Command Prompt as Administrator and run:
```cmd
mysql -u root -p
```

Then create the database:
```sql
CREATE DATABASE coffee_shop;
CREATE USER 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 2: Install Maven (Required)

### Option A: Using Chocolatey (Easiest)
If you have Chocolatey installed:
```cmd
choco install maven
```

### Option B: Manual Installation
1. Download Maven from: https://maven.apache.org/download.cgi
2. Download "apache-maven-3.9.x-bin.zip"
3. Extract to C:\Program Files\Apache\maven
4. Add to System PATH:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - Under System Variables, find "Path"
   - Click Edit → New
   - Add: C:\Program Files\Apache\maven\bin
   - Click OK
5. Verify: Open new Command Prompt and run `mvn -version`

## Step 3: Run the Backend

Once MySQL and Maven are installed:

```cmd
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on http://localhost:8080

## Step 4: Run the Frontend

Open a NEW Command Prompt window:

```cmd
cd frontend
npm install
npm start
```

The frontend will start on http://localhost:3000

## Alternative: Use H2 Database (No MySQL Required)

If you want to skip MySQL installation for testing, I can configure the project to use H2 (in-memory database):

1. Update `backend/pom.xml` to include H2
2. Update `application.properties` to use H2
3. Data will be lost when you stop the server

Would you like me to configure H2 instead?

## Verification

After installation, verify everything:

```cmd
java -version     # Should show Java 22
mvn -version      # Should show Maven 3.x
mysql --version   # Should show MySQL 8.x
node -v           # Should show Node 23.5.0
npm -v            # Should show npm version
```

## Quick Start After Installation

### Windows Batch Scripts
I've created batch scripts for you:

**Start Backend:**
```cmd
start-backend.bat
```

**Start Frontend:**
```cmd
start-frontend.bat
```

## Troubleshooting

### Maven not found after installation
- Close and reopen Command Prompt
- Verify PATH includes Maven bin directory
- Run: `echo %PATH%` to check

### MySQL connection refused
- Verify MySQL service is running
- Check Windows Services (services.msc)
- Look for "MySQL80" service
- Start it if stopped

### Port already in use
- Backend (8080): `netstat -ano | findstr :8080`
- Frontend (3000): `netstat -ano | findstr :3000`
- Kill process: `taskkill /PID <PID> /F`

## Next Steps

Once everything is installed:
1. Start MySQL service
2. Create database (see Step 1)
3. Run backend (see Step 3)
4. Run frontend (see Step 4)
5. Open http://localhost:3000
6. Login with: admin@coffeeshop.com / Admin@123

## Need Help?

If you encounter issues:
1. Check if all services are running
2. Review error messages carefully
3. Verify all prerequisites are installed
4. Check firewall settings
5. Ensure ports 3000, 8080, and 3306 are available
