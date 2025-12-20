# ☕ Coffee Shop Management System

A full-stack web application designed to streamline coffee shop operations. This system handles everything from Point of Sale (POS) and order management to inventory tracking and staff administration. Built with **Spring Boot** (Backend) and **React** (Frontend).

## 🚀 Key Features

*   **🔐 Role-Based Access Control (RBAC):** Secure login with specific roles:
    *   **Admin:** Full access to all modules (Menu, Users, Inventory, Analytics).
    *   **Cashier:** Access to POS system for placing orders.
    *   **Barista:** Real-time view of active orders to prepare.
    *   **Inventory Manager:** Manage stock levels and supplies.
*   **🛒 Point of Sale (POS):**
    *   Intuitive interface for Cashiers.
    *   **Category Filtering** & Search for quick item selection.
    *   Cart management, discount application, and tax calculation.
    *   Receipt generation (digital).
*   **📋 Order Management:**
    *   **Kitchen Display System (KDS)** for Baristas.
    *   Real-time order status updates (Created -> Completed/Cancelled).
*   **📦 Inventory Management:**
    *   **Automated Stock Deduction:** Ingredients are automatically deducted from inventory when orders are placed.
    *   Low stock alerts (visual indicators).
    *   Ingredient mapping (recipes) for menu items.
*   **🍔 Menu Management:**
    *   Add, edit, delete menu items and categories.
    *   Set prices, images, and ingredients.
*   **📊 Analytics & Reporting:**
    *   Dashboard with sales charts (Revenue, Orders per Day).
    *   Top-selling items and low-stock alerts.

## 🛠️ Technology Stack
*   [Node.js & npm](https://nodejs.org/)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/)
*   [Maven](https://maven.apache.org/) (Optional, wrapper included)
*   [Docker](https://www.docker.com/) (Optional, for containerized deployment)

## 📥 Installation & Setup

### 🚀 Quick Start with Docker (Recommended)

The easiest way to deploy the application is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/nampallyharish4/coffee-shop-management.git
cd coffee-shop-management

# Start all services (database, backend, frontend)
docker-compose up -d --build

# Access the application
# Frontend: http://localhost:80
# Backend: http://localhost:8081
# Swagger: http://localhost:8081/swagger-ui.html
```

**📖 For detailed deployment instructions, see:**
- [QUICKSTART.md](QUICKSTART.md) - Get started in minutes
- [DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive deployment guide with Docker, manual setup, and production deployment

### ⚙️ Manual Setup

If you prefer to run services without Docker:

### 1. Database Setup
1.  Open your MySQL Client (Workbench or Command Line).
2.  Run the provided setup script located at `setup-mysql.sql` to create the database and user.
    ```sql
    source setup-mysql.sql;
    ```
    *This creates the `coffee_shop` database and a user `coffee_admin` with password `Coffee@123`.*

### 2. Running the Application (Quick Start)
The easiest way to run the application is to use the all-in-one launcher script:
```bash
start_app.bat
```
This script will launch both the backend and frontend in separate windows.

### 3. Manual Startup
**Backend:**
1.  Navigate to the project root directory.
2.  Run the start script (or use `mvn spring-boot:run` inside `backend` folder):
    ```bash
    start-backend.bat
    ```
    *This will compile and start the server on port `8081`.*

**Frontend:**
1.  Run the start script (or use `npm start` inside `frontend` folder):
    ```bash
    start-frontend.bat
    ```
    *This will install dependencies and start the React dev server on port `3000`.*

## 🔑 Default Credentials

The system comes pre-configured with the following users for testing:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@coffeeshop.com` | `Admin@123` |
| **Cashier** | `cashier@coffeeshop.com` | `Cashier@123` |
| **Barista** | `barista@coffeeshop.com` | `Barista@123` |
| **Inventory** | `inventory@coffeeshop.com` | `Inventory@123` |

## 📂 Project Structure

```bash
COFFEE-SHOP/
├── backend/                 # Spring Boot Application
│   ├── src/main/java/       # Java Source Code
│   │   ├── config/          # Security & App Config
│   │   ├── controller/      # REST API Controllers
│   │   ├── entity/          # JPA Entities (DB Models)
│   │   ├── repository/      # Data Access Layer
│   │   ├── service/         # Business Logic
│   └── src/main/resources/  # Properties & Static Resources
│       └── application.properties
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Application Pages (Login, POS, etc.)
│   │   └── services/        # API Service Functions
├── setup-mysql.sql          # Database creation script
├── start-backend.bat        # Backend launch script
├── start-frontend.bat       # Frontend launch script
└── README.md                # Project Documentation
```

## 📖 API Documentation

Once the backend is running, you can explore the REST API via Swagger UI:
*   URL: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)


## 🛡️ License

This project is open-source and available for personal and educational use.
