# MySQL Database Setup Guide

## Step 1: Verify MySQL is Running

Open Command Prompt and check if MySQL is running:

```cmd
mysql --version
```

If MySQL is not in PATH, you can:
- Use MySQL Workbench (GUI)
- Navigate to MySQL bin directory (usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
- Or use MySQL Command Line Client from Start Menu

## Step 2: Connect to MySQL

### Option A: Using MySQL Command Line Client
1. Open "MySQL Command Line Client" from Start Menu
2. Enter your root password when prompted

### Option B: Using Command Prompt
```cmd
mysql -u root -p
```
Enter your root password when prompted.

## Step 3: Create Database and User

Once connected to MySQL, run these commands:

```sql
CREATE DATABASE IF NOT EXISTS coffee_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';

GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

Or you can use the provided SQL file:
```cmd
mysql -u root -p < setup-mysql.sql
```

## Step 4: Verify Database Configuration

The project is already configured with these settings in `backend/src/main/resources/application.properties`:

- **Database URL**: `jdbc:mysql://localhost:3306/coffee_shop`
- **Username**: `coffee_admin`
- **Password**: `Coffee@123`
- **Port**: `3306` (default MySQL port)

If your MySQL uses different credentials, update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/coffee_shop?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

## Step 5: Test MySQL Connection

Test the connection:

```cmd
mysql -u coffee_admin -p coffee_shop
```
Enter password: `Coffee@123`

If you can connect, you're all set!

## Step 6: Run the Backend with MySQL

**IMPORTANT**: Run the backend WITHOUT the H2 profile to use MySQL:

```cmd
cd backend
mvn spring-boot:run
```

**DO NOT** use:
```cmd
mvn spring-boot:run -Dspring-boot.run.profiles=h2  ❌ (This uses H2, not MySQL)
```

## Troubleshooting

### Issue: "Access denied for user"
- Check username and password in `application.properties`
- Verify user exists: `SELECT User, Host FROM mysql.user WHERE User = 'coffee_admin';`
- Recreate user if needed

### Issue: "Unknown database 'coffee_shop'"
- Run: `CREATE DATABASE coffee_shop;`
- Or the database will be created automatically if `createDatabaseIfNotExist=true` is in URL

### Issue: "Connection refused"
- Check if MySQL service is running
- Verify MySQL is on port 3306
- Check Windows Services: `services.msc` → Look for "MySQL80" or "MySQL"

### Issue: "Can't connect to MySQL server"
- Start MySQL service:
  ```cmd
  net start MySQL80
  ```
  (Service name may vary: MySQL, MySQL80, MySQL57, etc.)

## Verify Setup

After starting the backend, check the console output. You should see:
- ✅ "HikariPool-1 - Starting..."
- ✅ "HikariPool-1 - Start completed"
- ✅ "Started CoffeeShopApplication"

If you see H2-related messages, you're still using H2. Make sure you're NOT using the `-Dspring-boot.run.profiles=h2` flag.

