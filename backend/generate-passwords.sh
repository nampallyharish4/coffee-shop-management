#!/bin/bash
# This script generates BCrypt hashed passwords for the default users
# Run this after building the project to get the actual hashed passwords

echo "Default passwords for Coffee Shop Management System:"
echo "Admin: Admin@123"
echo "Cashier: Cashier@123"
echo "Barista: Barista@123"
echo "Inventory Manager: Inventory@123"
echo ""
echo "Note: All passwords use BCrypt encoding with strength 10"
echo "The actual hashed values are stored in the database"
