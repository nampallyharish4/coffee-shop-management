# Backend Fix Guide

## Common Issues and Solutions

### Issue 1: MySQL Connection Failed
**Error**: `Public Key Retrieval is not allowed` or `Access denied for user 'coffee_admin'`

**Solution**: Set up MySQL database and user first:

1. **Open MySQL Command Line Client** or **MySQL Workbench**
2. **Run these commands** (or use `setup-mysql.sql`):
```sql
CREATE DATABASE IF NOT EXISTS coffee_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';
FLUSH PRIVILEGES;
```

3. **Verify setup**:
```sql
SHOW DATABASES LIKE 'coffee_shop';
SELECT User, Host FROM mysql.user WHERE User = 'coffee_admin';
```

### Issue 2: Backend Won't Start
**Symptoms**: Java process runs but port 8080 not listening

**Solution**: 
1. Run `fix-backend.bat` - it will show detailed error messages
2. Check the console output for specific MySQL errors
3. Ensure MySQL service is running: `sc query MySQL80`

### Issue 3: Quick Testing Without MySQL
**Solution**: Use H2 in-memory database instead:

```cmd
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

This uses H2 database (no MySQL setup needed) but data is lost on restart.

## Step-by-Step Fix

### Step 1: Verify MySQL Setup
```cmd
# Check MySQL is running
sc query MySQL80

# Test MySQL connection (you'll need root password)
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### Step 2: Create Database and User
Run `setup-mysql.sql` in MySQL, or manually:

```sql
CREATE DATABASE IF NOT EXISTS coffee_shop;
CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Restart Backend
```cmd
# Option A: Use fix script
fix-backend.bat

# Option B: Manual restart
cd backend
mvn spring-boot:run
```

### Step 4: Verify Backend is Running
```cmd
# Check port 8080
netstat -ano | findstr ":8080"

# Test API
curl http://localhost:8080/api/auth/test
```

## Current Configuration

- **Database**: `coffee_shop`
- **Username**: `coffee_admin`
- **Password**: `Coffee@123`
- **Host**: `localhost:3306`
- **Port**: `8080`

## Troubleshooting

### MySQL Service Not Running
```cmd
net start MySQL80
```

### Can't Connect to MySQL
- Check MySQL is installed: `dir "C:\Program Files\MySQL"`
- Check service: `sc query MySQL80`
- Try MySQL Workbench GUI instead

### Port 8080 Already in Use
```cmd
# Find process using port 8080
netstat -ano | findstr ":8080"

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>
```

### Still Having Issues?
1. Check `backend/logs/` folder for error logs
2. Run backend with debug logging (already enabled)
3. Try H2 database mode for quick testing
4. Check MySQL error logs: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`

