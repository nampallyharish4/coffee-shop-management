# ☕ Deployment Guide - Coffee Shop Management System

This guide provides comprehensive instructions for deploying the Coffee Shop Management System in various environments.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Quick Start with Docker](#quick-start-with-docker)
4. [Manual Deployment](#manual-deployment)
5. [Production Deployment](#production-deployment)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### For Docker Deployment (Recommended)
- **Docker**: Version 20.10 or higher ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0 or higher (usually included with Docker Desktop)
- **Minimum System Requirements**:
  - 4 GB RAM
  - 10 GB free disk space
  - Multi-core processor

### For Manual Deployment
- **Java**: JDK 17 or higher
- **Node.js**: Version 18 or higher
- **MySQL**: Version 8.0 or higher
- **Maven**: Version 3.6 or higher (optional, wrapper included)

---

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended)
Best for development, testing, and simple production deployments. All services run in containers with minimal configuration.

### Option 2: Manual Deployment
Best for development when you need to modify code frequently or have specific environment requirements.

### Option 3: Cloud Deployment
Deploy to cloud platforms like AWS, Azure, Google Cloud, or Heroku.

---

## 🐳 Quick Start with Docker

### Step 1: Clone the Repository
```bash
git clone https://github.com/nampallyharish4/coffee-shop-management.git
cd coffee-shop-management
```

### Step 2: Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your configuration (optional)
# The default values work for development
nano .env  # or use your preferred editor
```

### Step 3: Deploy with Docker Compose

#### Using the deployment script (Linux/Mac):
```bash
./deploy.sh
```
Then select option 1 to build and start all services.

#### Using Docker Compose directly:
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Step 4: Access the Application
Once all services are running:

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8081
- **Swagger API Docs**: http://localhost:8081/swagger-ui.html

### Step 5: Login with Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@coffeeshop.com | Admin@123 |
| **Cashier** | cashier@coffeeshop.com | Cashier@123 |
| **Barista** | barista@coffeeshop.com | Barista@123 |
| **Inventory** | inventory@coffeeshop.com | Inventory@123 |

---

## 🔨 Manual Deployment

### Step 1: Database Setup

1. Install and start MySQL server
2. Create the database and user:
```bash
mysql -u root -p < setup-mysql.sql
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS coffee_shop;
CREATE USER IF NOT EXISTS 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';
GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Backend Setup

```bash
cd backend

# Configure application.properties if needed
# Default configuration connects to localhost:3306

# Build and run using Maven
./mvnw clean package
./mvnw spring-boot:run

# Or use the provided script (Windows)
# cd ..
# start-backend.bat
```

The backend will start on http://localhost:8081

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Or build for production
npm run build

# Or use the provided script (Windows)
# cd ..
# start-frontend.bat
```

The frontend will start on http://localhost:3000

---

## 🌐 Production Deployment

### Security Checklist

Before deploying to production:

1. **Change Default Passwords**
   - Update MySQL root password
   - Update application database user password
   - Change default user credentials in the application

2. **Update JWT Secret**
   ```bash
   # Generate a strong JWT secret (256-bit minimum)
   openssl rand -base64 32
   ```
   Update `JWT_SECRET` in `.env` or `application.properties`

3. **Configure CORS**
   Update `cors.allowed-origins` in `application.properties` to your domain:
   ```properties
   cors.allowed-origins=https://yourdomain.com
   ```

4. **Enable HTTPS**
   - Use a reverse proxy (Nginx, Apache)
   - Configure SSL certificates (Let's Encrypt recommended)

5. **Database Configuration**
   ```properties
   # Set to validate or none in production
   spring.jpa.hibernate.ddl-auto=validate
   ```

### Docker Production Deployment

1. **Update .env for production**:
```bash
cp .env.example .env
nano .env
```

Update these critical values:
```env
MYSQL_ROOT_PASSWORD=your-secure-root-password
MYSQL_PASSWORD=your-secure-db-password
JWT_SECRET=your-secure-jwt-secret-256-bits
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

2. **Deploy with Docker Compose**:
```bash
docker-compose up -d --build
```

3. **Setup Reverse Proxy (Nginx Example)**:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Cloud Platform Deployment

#### AWS EC2 Deployment

1. Launch an EC2 instance (Ubuntu 22.04 LTS recommended)
2. Install Docker and Docker Compose
3. Clone repository and configure
4. Use security groups to allow ports 80, 443, 8081
5. Deploy using Docker Compose

#### Heroku Deployment

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create apps
heroku create coffee-shop-backend
heroku create coffee-shop-frontend

# Add MySQL addon
heroku addons:create cleardb:ignite -a coffee-shop-backend

# Deploy backend
cd backend
git subtree push --prefix backend heroku master

# Deploy frontend
cd ../frontend
git subtree push --prefix frontend heroku master
```

#### Azure Deployment

Use Azure App Service with Docker container support:
1. Create Azure Container Registry
2. Push Docker images to registry
3. Create App Service with container
4. Configure environment variables

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | rootpassword |
| `MYSQL_DATABASE` | Database name | coffee_shop |
| `MYSQL_USER` | Database user | coffee_admin |
| `MYSQL_PASSWORD` | Database password | Coffee@123 |
| `MYSQL_PORT` | MySQL port | 3306 |
| `BACKEND_PORT` | Backend port | 8081 |
| `FRONTEND_PORT` | Frontend port | 80 |
| `JWT_SECRET` | JWT signing secret | (default provided) |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | update |
| `REACT_APP_API_URL` | Backend API URL | http://localhost:8081 |

### Backend Configuration (application.properties)

Key configurations in `backend/src/main/resources/application.properties`:

```properties
# Server port
server.port=8081

# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/coffee_shop
spring.datasource.username=coffee_admin
spring.datasource.password=Coffee@123

# JWT configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration

Configure the API endpoint in frontend code if needed:
- Development: API calls go to `http://localhost:8081`
- Production: Update `REACT_APP_API_URL` environment variable

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `Port 3306/8081/80 is already in use`

**Solution**:
```bash
# Find and kill the process using the port
# Linux/Mac:
lsof -ti:3306 | xargs kill -9
lsof -ti:8081 | xargs kill -9
lsof -ti:80 | xargs kill -9

# Windows:
netstat -ano | findstr :3306
taskkill /PID <PID> /F

# Or change the port in .env file
MYSQL_PORT=3307
BACKEND_PORT=8082
FRONTEND_PORT=8080
```

#### 2. Database Connection Failed

**Error**: `Unable to connect to database`

**Solution**:
- Ensure MySQL is running
- Check credentials in `.env` or `application.properties`
- Verify database exists: `SHOW DATABASES;`
- Check if user has privileges: `SHOW GRANTS FOR 'coffee_admin'@'localhost';`

#### 3. Docker Build Fails

**Error**: Build errors during `docker-compose up`

**Solution**:
```bash
# Clean up Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker logs
docker-compose logs backend
docker-compose logs frontend
```

#### 4. Backend Health Check Fails

**Error**: Backend container keeps restarting

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Common causes:
# - Database not ready: Wait 30-60 seconds
# - Wrong credentials: Check .env file
# - Port conflict: Change BACKEND_PORT in .env
```

#### 5. Frontend Can't Connect to Backend

**Error**: API calls fail from frontend

**Solution**:
- Check backend is running: `curl http://localhost:8081/actuator/health`
- Verify CORS configuration in backend
- Update `REACT_APP_API_URL` if backend is on different host
- Check browser console for CORS errors

### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Stop all services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v

# Rebuild a specific service
docker-compose up -d --build backend

# Access container shell
docker exec -it coffee-shop-backend sh
docker exec -it coffee-shop-db mysql -u coffee_admin -p
```

### Health Checks

Check if services are healthy:

```bash
# Backend health
curl http://localhost:8081/actuator/health

# Database connection
docker exec coffee-shop-db mysqladmin ping -h localhost -u root -prootpassword

# Frontend
curl http://localhost:80
```

---

## 📊 Monitoring and Maintenance

### View Application Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f database
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database Backup

```bash
# Backup database
docker exec coffee-shop-db mysqldump -u coffee_admin -pCoffee@123 coffee_shop > backup.sql

# Restore database
docker exec -i coffee-shop-db mysql -u coffee_admin -pCoffee@123 coffee_shop < backup.sql
```

### Performance Monitoring

- Use Docker stats: `docker stats`
- Backend metrics: http://localhost:8081/actuator/metrics
- Database monitoring tools (MySQL Workbench, phpMyAdmin)

---

## 🆘 Getting Help

- **Issues**: Report bugs on [GitHub Issues](https://github.com/nampallyharish4/coffee-shop-management/issues)
- **Documentation**: Check `/documentation` folder for detailed guides
- **Logs**: Always check logs when troubleshooting: `docker-compose logs -f`

---

## 📝 License

This project is open-source and available for personal and educational use.
