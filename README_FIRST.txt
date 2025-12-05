================================================================================
        COFFEE SHOP MANAGEMENT SYSTEM - READ ME FIRST
================================================================================

CURRENT STATUS:
---------------
✅ Java 22 installed
✅ Node.js 23.5.0 installed
❌ Maven NOT installed (REQUIRED)
❌ MySQL NOT installed (Optional - can use H2)

WHAT YOU NEED TO DO:
--------------------

STEP 1: INSTALL MAVEN (5 minutes)
----------------------------------
Download from: https://maven.apache.org/download.cgi
Get: apache-maven-3.9.6-bin.zip
Extract to: C:\maven
Add to PATH: C:\maven\bin
Restart Command Prompt
Verify: mvn -version

OR use Chocolatey:
choco install maven


STEP 2: RUN BACKEND (30 seconds)
---------------------------------
Open Command Prompt in project folder:

    cd backend
    mvn spring-boot:run -Dspring-boot.run.profiles=h2

Wait for: "Started CoffeeShopApplication"


STEP 3: RUN FRONTEND (30 seconds)
----------------------------------
Open NEW Command Prompt in project folder:

    cd frontend
    npm install
    npm start

Browser opens automatically at http://localhost:3000


STEP 4: LOGIN
-------------
Email: admin@coffeeshop.com
Password: Admin@123


IMPORTANT URLS:
---------------
Frontend:    http://localhost:3000
Backend API: http://localhost:8080
Swagger UI:  http://localhost:8080/swagger-ui.html
H2 Console:  http://localhost:8080/h2-console


TEST ACCOUNTS:
--------------
Admin:     admin@coffeeshop.com     / Admin@123
Cashier:   cashier@coffeeshop.com   / Cashier@123
Barista:   barista@coffeeshop.com   / Barista@123
Inventory: inventory@coffeeshop.com / Inventory@123


TROUBLESHOOTING:
----------------
"mvn is not recognized"
→ Maven not installed or not in PATH
→ Restart Command Prompt after installation

Backend won't start
→ Port 8080 in use: netstat -ano | findstr :8080
→ Kill process: taskkill /PID <number> /F

Frontend won't start
→ Port 3000 in use: netstat -ano | findstr :3000
→ Kill process: taskkill /PID <number> /F


DETAILED GUIDES:
----------------
📖 START_HERE.md          - Complete step-by-step guide
📖 SIMPLE_SETUP.md        - Simple setup instructions
📖 INSTALLATION_STEPS.md  - Detailed installation guide
📖 QUICK_START.md         - 5-minute quick start
📖 API_DOCUMENTATION.md   - API reference
📖 FEATURES.md            - Feature list


WHAT IS H2?
-----------
H2 is an in-memory database that requires no installation.
Perfect for testing. Data is lost when backend stops.
For production, use MySQL instead.


NEXT STEPS:
-----------
1. Install Maven
2. Run backend (Terminal 1)
3. Run frontend (Terminal 2)
4. Open http://localhost:3000
5. Login and explore!


FEATURES INCLUDED:
------------------
✅ User Management (Admin, Cashier, Barista, Inventory Manager)
✅ Menu Management (CRUD with categories)
✅ Point of Sale (POS) - Create orders
✅ Barista View - Kitchen order tracking
✅ Inventory Management - Stock tracking with alerts
✅ Analytics & Reports - Sales, top items, staff performance
✅ JWT Authentication & Role-based access
✅ Swagger API Documentation
✅ Sample data pre-loaded


SYSTEM REQUIREMENTS:
--------------------
✅ Java 17+ (You have Java 22)
✅ Node.js 16+ (You have Node.js 23.5.0)
❌ Maven 3.6+ (NEED TO INSTALL)
⚠️  MySQL 8.0+ (Optional - using H2 for now)


QUICK COMMANDS:
---------------
# Check installations
java -version
node -v
mvn -version

# Run backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2

# Run frontend
cd frontend
npm install
npm start


SUPPORT:
--------
All documentation is in the project folder.
Start with START_HERE.md for detailed instructions.


================================================================================
                    READY TO START? INSTALL MAVEN FIRST!
================================================================================
