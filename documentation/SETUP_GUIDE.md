# Coffee Shop Management System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **JDK 17 or higher** - [Download](https://adoptium.net/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Node.js 16+ and npm** - [Download](https://nodejs.org/)

## Step 1: Database Setup

### 1.1 Install MySQL

Install MySQL 8.0 or higher on your system.

### 1.2 Create Database and User

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE coffee_shop;

CREATE USER 'coffee_admin'@'localhost' IDENTIFIED BY 'Coffee@123';

GRANT ALL PRIVILEGES ON coffee_shop.* TO 'coffee_admin'@'localhost';

FLUSH PRIVILEGES;
```

### 1.3 Verify Connection

Test the connection:
```bash
mysql -u coffee_admin -p coffee_shop
# Enter password: Coffee@123
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Configure Database (Optional)

If you want to use different database credentials, edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/coffee_shop
spring.datasource.username=coffee_admin
spring.datasource.password=Coffee@123
```

### 2.3 Build the Project

```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests
- Create the JAR file

### 2.4 Run the Backend

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2.5 Verify Backend is Running

Open your browser and navigate to:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/api-docs`

You should see the API documentation.

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

Open a new terminal window:

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

This will download all required npm packages.

### 3.3 Run the Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Step 4: Login and Test

### 4.1 Access the Application

Navigate to `http://localhost:3000` in your browser.

### 4.2 Login with Default Credentials

Use one of these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@coffeeshop.com | Admin@123 |
| Cashier | cashier@coffeeshop.com | Cashier@123 |
| Barista | barista@coffeeshop.com | Barista@123 |
| Inventory Manager | inventory@coffeeshop.com | Inventory@123 |

### 4.3 Test Features

1. **Admin**: Login as admin and explore all features
2. **POS**: Login as cashier and create test orders
3. **Barista View**: Login as barista and update order status
4. **Inventory**: Login as inventory manager and manage stock

## Troubleshooting

### Backend Issues

**Problem: Port 8080 already in use**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

**Problem: Database connection failed**
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database `coffee_shop` exists

**Problem: Build fails**
- Ensure JDK 17+ is installed: `java -version`
- Clear Maven cache: `mvn clean`
- Delete `~/.m2/repository` and rebuild

### Frontend Issues

**Problem: Port 3000 already in use**
- Kill the process using port 3000
- Or set a different port: `PORT=3001 npm start`

**Problem: npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Problem: Cannot connect to backend**
- Verify backend is running on port 8080
- Check CORS settings in `SecurityConfig.java`
- Verify API base URL in `frontend/src/services/api.js`

## Production Deployment

### Backend

1. Build production JAR:
```bash
mvn clean package -DskipTests
```

2. Run the JAR:
```bash
java -jar target/coffee-shop-backend-1.0.0.jar
```

### Frontend

1. Build production bundle:
```bash
npm run build
```

2. Serve the `build` folder using a web server (nginx, Apache, etc.)

### Environment Variables

For production, use environment variables instead of hardcoded values:

**Backend:**
```bash
export DB_URL=jdbc:mysql://production-host:3306/coffee_shop
export DB_USERNAME=prod_user
export DB_PASSWORD=secure_password
export JWT_SECRET=your-secure-secret-key
```

**Frontend:**
```bash
export REACT_APP_API_URL=https://api.yourdomain.com
```

## Next Steps

1. **Customize**: Modify the application to fit your specific needs
2. **Add Features**: Implement customer-facing app, delivery integration
3. **Security**: Change default passwords, use strong JWT secrets
4. **Monitoring**: Add logging and monitoring tools
5. **Backup**: Set up regular database backups

## Support

For issues or questions:
- Check the README.md
- Review API_DOCUMENTATION.md
- Check DATABASE_SCHEMA.md
- Review the code comments

## License

This project is provided as-is for educational and commercial use.
