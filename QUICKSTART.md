# ☕ Quick Start Guide - Coffee Shop Management System

Get the Coffee Shop Management System up and running in minutes!

## 🚀 Fastest Way to Deploy (Docker)

### 1. Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- 4GB RAM minimum
- 10GB free disk space

### 2. Deploy in 3 Commands

```bash
# Clone the repository
git clone https://github.com/nampallyharish4/coffee-shop-management.git
cd coffee-shop-management

# Start all services with Docker Compose
docker-compose up -d --build

# Wait 1-2 minutes for all services to start, then access:
# Frontend: http://localhost:80
# Backend API: http://localhost:8081
# Swagger Docs: http://localhost:8081/swagger-ui.html
```

### 3. Login

Use these default credentials to login:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@coffeeshop.com | Admin@123 |
| **Cashier** | cashier@coffeeshop.com | Cashier@123 |
| **Barista** | barista@coffeeshop.com | Barista@123 |
| **Inventory** | inventory@coffeeshop.com | Inventory@123 |

## 🛠️ Alternative: Manual Setup

If you prefer not to use Docker:

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Setup Steps

1. **Setup Database**
```bash
mysql -u root -p < setup-mysql.sql
```

2. **Start Backend**
```bash
cd backend
./mvnw spring-boot:run
# Backend runs on http://localhost:8081
```

3. **Start Frontend** (new terminal)
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 📚 Full Documentation

For detailed deployment options, configuration, troubleshooting, and production deployment:
- See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive guide
- See [README.md](README.md) for feature overview

## 🎯 What's Next?

1. **Explore Features**: Login as different roles to see role-based access
2. **Configure**: Copy `.env.example` to `.env` and customize
3. **Production**: Follow security checklist in DEPLOYMENT.md before deploying to production

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Clean up everything
docker-compose down -v --rmi all
```

## ❓ Need Help?

- **Deployment Issues**: See [DEPLOYMENT.md](DEPLOYMENT.md) Troubleshooting section
- **Feature Questions**: See [README.md](README.md)
- **Report Bugs**: [GitHub Issues](https://github.com/nampallyharish4/coffee-shop-management/issues)

---

**That's it! You're ready to manage your coffee shop!** ☕
