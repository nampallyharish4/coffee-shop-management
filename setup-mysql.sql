-- MySQL Database Setup Script for Coffee Shop Management System
-- Run this script in MySQL command line or MySQL Workbench

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS coffee_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Step 2: Create user (if not exists)
-- Note: If user already exists, you can skip this or use: DROP USER IF EXISTS 'coffee_admin'@'localhost';
CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';

-- Step 3: Grant privileges
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';

-- Step 4: Apply changes
FLUSH PRIVILEGES;

-- Step 5: Verify (optional - run these to check)
-- SHOW DATABASES;
-- SELECT User, Host FROM mysql.user WHERE User = 'coffee_admin';
-- SHOW GRANTS FOR 'coffee_admin'@'localhost';

