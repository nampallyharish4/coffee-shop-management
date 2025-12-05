# MySQL Setup Instructions for Coffee Shop Project

## Current Configuration

Your project is already configured to use MySQL with these settings:
- **Database**: `coffee_shop`
- **Username**: `coffee_admin`
- **Password**: `Coffee@123`
- **Host**: `localhost`
- **Port**: `3306`

## Step 1: Access MySQL

Since MySQL is not in your PATH, use one of these methods:

### Method 1: MySQL Command Line Client (Easiest)
1. Press `Windows Key`
2. Type "MySQL Command Line Client"
3. Click on it
4. Enter your MySQL root password

### Method 2: MySQL Workbench (GUI - Recommended)
1. Open MySQL Workbench
2. Connect to your MySQL server (usually "Local instance MySQL80")
3. Enter your root password

### Method 3: Find MySQL Bin Directory
1. Usually located at: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
2. Open Command Prompt in that directory
3. Run: `mysql.exe -u root -p`

## Step 2: Create Database and User

Once connected to MySQL, copy and paste these commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS coffee_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';

-- Grant privileges
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify (optional)
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'coffee_admin';
```

## Step 3: Verify Connection

Test the connection with the new user:

```sql
-- In MySQL, run:
USE coffee_shop;
SHOW TABLES;
EXIT;
```

Or from command line (if MySQL is in PATH):
```cmd
mysql -u coffee_admin -p coffee_shop
Password: Coffee@123
```

## Step 4: Update Configuration (If Needed)

If your MySQL uses different credentials, edit:
`backend/src/main/resources/application.properties`

Update these lines:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/coffee_shop?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=coffee_admin
spring.datasource.password=Coffee@123
```

## Step 5: Run Backend with MySQL

**IMPORTANT**: Run WITHOUT the H2 profile:

```cmd
cd backend
mvn spring-boot:run
```

**DO NOT** use:
```cmd
mvn spring-boot:run -Dspring-boot.run.profiles=h2  ❌
```

## Step 6: Verify It's Working

When the backend starts, check the console for:
- ✅ "HikariPool-1 - Starting..." (MySQL connection pool)
- ✅ "HikariPool-1 - Start completed"
- ✅ "Started CoffeeShopApplication"

If you see "H2" mentioned, you're still using H2. Make sure you're NOT using the `-Dspring-boot.run.profiles=h2` flag.

## Troubleshooting

### MySQL Service Not Running
```cmd
# Check if MySQL service is running
sc query MySQL80

# Start MySQL service (as Administrator)
net start MySQL80
```

### Can't Find MySQL
- Check if MySQL is installed: Look in `C:\Program Files\MySQL\`
- Or use MySQL Workbench GUI instead

### Connection Refused
- Verify MySQL is running on port 3306
- Check Windows Services: `services.msc` → Find "MySQL80" or "MySQL"

### Access Denied
- Verify username and password in `application.properties`
- Check if user exists: `SELECT User, Host FROM mysql.user;`
- Recreate user if needed

### Different MySQL Port
If your MySQL uses a different port (not 3306), update:
```properties
spring.datasource.url=jdbc:mysql://localhost:YOUR_PORT/coffee_shop?...
```

## Quick Test

After setup, test the connection:
```cmd
cd backend
mvn spring-boot:run
```

Look for these success messages:
- "HikariPool-1 - Start completed"
- "Started CoffeeShopApplication"

If you see errors, check the error message and refer to troubleshooting section above.

