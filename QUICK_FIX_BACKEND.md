# Quick Backend Fix Guide

## The Problem
Backend BUILD FAILURE - likely due to MySQL connection issues.

## Quick Solutions

### Solution 1: Test with H2 Database (No MySQL Setup Needed)

This will help determine if the issue is MySQL-related:

```cmd
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

**If this works**: The issue is MySQL configuration. Proceed to Solution 2.

**If this fails**: There's a different issue. Check compilation errors.

### Solution 2: Fix MySQL Connection

The backend needs MySQL database and user to be set up first.

#### Option A: Using MySQL Command Line Client

1. Open **"MySQL Command Line Client"** from Start Menu
2. Enter your MySQL root password
3. Run these commands:

```sql
CREATE DATABASE IF NOT EXISTS coffee_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open a new SQL tab
4. Copy and paste the SQL commands from `setup-mysql.sql`
5. Execute the script

#### Option C: Using Command Line (if MySQL is in PATH)

```cmd
mysql -u root -p < setup-mysql.sql
```

### Solution 3: Run Diagnostic Tool

Run the diagnostic script to identify the exact issue:

```cmd
diagnose-backend.bat
```

This will:
- Check Java/Maven installation
- Check MySQL service status
- Test compilation
- Optionally start with H2 or MySQL

### Solution 4: Manual Backend Start

After MySQL is set up:

```cmd
cd backend
mvn clean compile
mvn spring-boot:run
```

## Verify Backend is Running

After starting, wait 30-60 seconds, then check:

```cmd
netstat -ano | findstr ":8080"
```

If port 8080 appears, backend is running!

Test it:
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html

## Common Errors

### Error: "Public Key Retrieval is not allowed"
**Fixed**: Already added `allowPublicKeyRetrieval=true` to connection URL.

### Error: "Access denied for user 'coffee_admin'"
**Fix**: User doesn't exist. Run MySQL setup (Solution 2).

### Error: "Unknown database 'coffee_shop'"
**Fix**: Database doesn't exist. Run MySQL setup (Solution 2).

### Error: BUILD FAILURE
**Possible causes**:
1. MySQL connection failed (most common)
2. Compilation error
3. Missing dependencies

**Fix**: 
- Run `diagnose-backend.bat` to identify
- Try H2 database first to isolate the issue
- Check compilation: `mvn clean compile`

## Current Configuration

- **Database**: `coffee_shop`
- **Username**: `coffee_admin`
- **Password**: `Coffee@123`
- **Host**: `localhost:3306`
- **Backend Port**: `8080`

## Next Steps

1. **Quick Test**: Run with H2 to verify backend works
2. **Set Up MySQL**: Create database and user
3. **Restart Backend**: Run with MySQL configuration
4. **Verify**: Check port 8080 is listening

