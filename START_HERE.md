# 🚀 START HERE - Coffee Shop Management System

## ⚡ Your Current Status

✅ **You Have:**
- Java 22 (Perfect!)
- Node.js 23.5.0 (Perfect!)

❌ **You Need to Install:**
- Maven (Required to build and run backend)
- MySQL (Optional - can use H2 for testing)

---

## 🎯 FASTEST WAY TO RUN (Recommended)

### Step 1: Install Maven (5 minutes)

**Option A - Using Chocolatey (Easiest):**
```cmd
choco install maven
```

**Option B - Manual Install:**
1. Go to: https://maven.apache.org/download.cgi
2. Download: `apache-maven-3.9.6-bin.zip`
3. Extract to: `C:\maven`
4. Add to System PATH:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit" → "New"
   - Add: `C:\maven\bin`
   - Click "OK" on all windows
5. **IMPORTANT:** Close and reopen Command Prompt
6. Verify: `mvn -version`

### Step 2: Run Backend (30 seconds)

Open Command Prompt in project folder:
```cmd
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Wait for: `Started CoffeeShopApplication in X seconds`

### Step 3: Run Frontend (30 seconds)

Open a NEW Command Prompt in project folder:
```cmd
cd frontend
npm install
npm start
```

Browser will open automatically at http://localhost:3000

### Step 4: Login and Test! 🎉

**Login with:**
- Email: `admin@coffeeshop.com`
- Password: `Admin@123`

---

## 📋 What Each Command Does

### Backend Command Explained
```cmd
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
- `mvn` = Maven command
- `spring-boot:run` = Start Spring Boot application
- `-Dspring-boot.run.profiles=h2` = Use H2 database (no MySQL needed)

### Frontend Command Explained
```cmd
npm install    # Downloads all required packages (first time only)
npm start      # Starts React development server
```

---

## 🔍 How to Know It's Working

### Backend is Ready When You See:
```
Started CoffeeShopApplication in 15.234 seconds (process running for 15.789)
```

### Frontend is Ready When You See:
```
Compiled successfully!

You can now view coffee-shop-frontend in the browser.

  Local:            http://localhost:3000
```

---

## 🌐 Important URLs

Once running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8080/api | REST API |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | API Documentation |
| **H2 Console** | http://localhost:8080/h2-console | Database viewer |

---

## 👥 Test Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👑 Admin | admin@coffeeshop.com | Admin@123 | Everything |
| 💰 Cashier | cashier@coffeeshop.com | Cashier@123 | POS, Orders |
| ☕ Barista | barista@coffeeshop.com | Barista@123 | Kitchen View |
| 📦 Inventory | inventory@coffeeshop.com | Inventory@123 | Stock Management |

---

## 🧪 Quick Test Scenario

1. **Login as Cashier** (cashier@coffeeshop.com / Cashier@123)
2. Go to **POS**
3. Add items: 2x Latte, 1x Croissant
4. Select payment: Cash
5. Click "Complete Order"
6. **Open new tab** → Login as Barista
7. Go to **Barista View**
8. See your order → Update status
9. **Switch back to Admin** account
10. Go to **Analytics** → See the sale!

---

## ❌ Troubleshooting

### "mvn is not recognized"
**Problem:** Maven not installed or not in PATH

**Solution:**
1. Install Maven (see Step 1 above)
2. **Close and reopen Command Prompt**
3. Try again: `mvn -version`

### Backend won't start
**Problem:** Port 8080 already in use

**Solution:**
```cmd
netstat -ano | findstr :8080
taskkill /PID <number> /F
```

### Frontend won't start
**Problem:** Port 3000 already in use

**Solution:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### "Cannot connect to backend"
**Problem:** Backend not running

**Solution:**
1. Check Terminal 1 - backend should be running
2. Visit: http://localhost:8080/swagger-ui.html
3. If it doesn't load, backend isn't running

---

## 🎓 Understanding the Stack

### Backend (Spring Boot)
- **Language:** Java
- **Framework:** Spring Boot
- **Database:** H2 (in-memory) or MySQL
- **Port:** 8080
- **Purpose:** REST API, business logic, data storage

### Frontend (React)
- **Language:** JavaScript (React)
- **UI Library:** Material-UI
- **Port:** 3000
- **Purpose:** User interface, forms, dashboards

### How They Connect
```
Browser (localhost:3000)
    ↓
React Frontend
    ↓ HTTP Requests
Backend API (localhost:8080)
    ↓
Database (H2 or MySQL)
```

---

## 📦 What's Included

The system comes with sample data:
- ✅ 4 user accounts (Admin, Cashier, Barista, Inventory Manager)
- ✅ 5 categories (Coffee, Snacks, Beverages, Add-ons, Seasonal)
- ✅ 6 menu items (Espresso, Latte, Cappuccino, Mocha, Croissant, Tea)
- ✅ 7 inventory items (Milk, Beans, Sugar, etc.)

---

## 🚀 After First Run

Next time you want to run the project:

**Terminal 1:**
```cmd
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

**Terminal 2:**
```cmd
cd frontend
npm start
```

That's it! Much faster after the first time.

---

## 💾 About H2 Database

**What is H2?**
- In-memory database (no installation needed)
- Perfect for testing and development
- Data is reset when you stop the backend

**When to use MySQL instead?**
- Production deployment
- Need data to persist
- Multiple developers sharing database

**To use MySQL:**
1. Install MySQL
2. Create database (see INSTALLATION_STEPS.md)
3. Run: `mvn spring-boot:run` (without -Dspring-boot.run.profiles=h2)

---

## 📚 More Documentation

- **SIMPLE_SETUP.md** - Detailed setup guide
- **INSTALLATION_STEPS.md** - Install MySQL and Maven
- **API_DOCUMENTATION.md** - API reference
- **FEATURES.md** - Complete feature list
- **QUICK_START.md** - 5-minute quick start

---

## ✅ Checklist

Before running:
- [ ] Java installed (check: `java -version`)
- [ ] Node.js installed (check: `node -v`)
- [ ] Maven installed (check: `mvn -version`)
- [ ] Ports 3000 and 8080 are free
- [ ] Two Command Prompt windows open

Running:
- [ ] Backend started (Terminal 1)
- [ ] Frontend started (Terminal 2)
- [ ] Browser opened to http://localhost:3000
- [ ] Logged in successfully

---

## 🎉 You're Ready!

Once you see the login page, you're all set! The system is fully functional with:
- User management
- Menu management
- Order processing (POS)
- Kitchen view (Barista)
- Inventory tracking
- Analytics and reports

**Enjoy your Coffee Shop Management System! ☕**

---

## 🆘 Still Need Help?

1. Check if Maven is installed: `mvn -version`
2. Check if backend is running: http://localhost:8080/swagger-ui.html
3. Check if frontend is running: http://localhost:3000
4. Read error messages carefully
5. Review SIMPLE_SETUP.md for detailed steps
