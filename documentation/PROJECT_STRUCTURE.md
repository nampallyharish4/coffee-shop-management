# Project Structure

```
coffee-shop-management/
│
├── README.md                          # Main project documentation
├── SETUP_GUIDE.md                     # Detailed setup instructions
├── API_DOCUMENTATION.md               # Complete API reference
├── DATABASE_SCHEMA.md                 # Database schema documentation
├── PROJECT_STRUCTURE.md               # This file
├── .gitignore                         # Git ignore rules
├── start-backend.bat                  # Windows script to start backend
├── start-frontend.bat                 # Windows script to start frontend
│
├── backend/                           # Spring Boot Backend
│   ├── pom.xml                        # Maven dependencies
│   ├── generate-passwords.sh          # Password generation helper
│   │
│   └── src/
│       ├── main/
│       │   ├── java/com/coffeeshop/
│       │   │   ├── CoffeeShopApplication.java    # Main application class
│       │   │   │
│       │   │   ├── config/                       # Configuration classes
│       │   │   │   ├── DataInitializer.java      # Initialize default data
│       │   │   │   ├── OpenApiConfig.java        # Swagger configuration
│       │   │   │   └── SecurityConfig.java       # Security & JWT config
│       │   │   │
│       │   │   ├── controller/                   # REST Controllers
│       │   │   │   ├── AnalyticsController.java  # Analytics endpoints
│       │   │   │   ├── AuthController.java       # Authentication
│       │   │   │   ├── CategoryController.java   # Category management
│       │   │   │   ├── InventoryController.java  # Inventory management
│       │   │   │   ├── MenuController.java       # Menu management
│       │   │   │   ├── OrderController.java      # Order management
│       │   │   │   └── UserController.java       # User management
│       │   │   │
│       │   │   ├── dto/                          # Data Transfer Objects
│       │   │   │   ├── ApiResponse.java          # Standard API response
│       │   │   │   ├── InventoryItemDTO.java     # Inventory item DTO
│       │   │   │   ├── JwtResponse.java          # JWT response
│       │   │   │   ├── LoginRequest.java         # Login request
│       │   │   │   ├── MenuItemDTO.java          # Menu item DTO
│       │   │   │   ├── OrderDTO.java             # Order DTO
│       │   │   │   └── UserDTO.java              # User DTO
│       │   │   │
│       │   │   ├── entity/                       # JPA Entities
│       │   │   │   ├── Category.java             # Category entity
│       │   │   │   ├── InventoryItem.java        # Inventory item entity
│       │   │   │   ├── InventoryUsage.java       # Inventory usage tracking
│       │   │   │   ├── MenuItem.java             # Menu item entity
│       │   │   │   ├── MenuIngredient.java       # Menu-inventory mapping
│       │   │   │   ├── Order.java                # Order entity
│       │   │   │   ├── OrderItem.java            # Order item entity
│       │   │   │   ├── Payment.java              # Payment entity
│       │   │   │   ├── Role.java                 # Role entity
│       │   │   │   └── User.java                 # User entity
│       │   │   │
│       │   │   ├── exception/                    # Exception Handling
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   └── ResourceNotFoundException.java
│       │   │   │
│       │   │   ├── repository/                   # Data Repositories
│       │   │   │   ├── CategoryRepository.java
│       │   │   │   ├── InventoryItemRepository.java
│       │   │   │   ├── InventoryUsageRepository.java
│       │   │   │   ├── MenuItemRepository.java
│       │   │   │   ├── OrderItemRepository.java
│       │   │   │   ├── OrderRepository.java
│       │   │   │   ├── PaymentRepository.java
│       │   │   │   ├── RoleRepository.java
│       │   │   │   └── UserRepository.java
│       │   │   │
│       │   │   ├── security/                     # Security Components
│       │   │   │   ├── AuthEntryPointJwt.java    # JWT entry point
│       │   │   │   ├── AuthTokenFilter.java      # JWT filter
│       │   │   │   ├── JwtUtils.java             # JWT utilities
│       │   │   │   ├── UserDetailsImpl.java      # User details impl
│       │   │   │   └── UserDetailsServiceImpl.java
│       │   │   │
│       │   │   └── service/                      # Business Logic
│       │   │       ├── AnalyticsService.java     # Analytics service
│       │   │       ├── AuthService.java          # Authentication service
│       │   │       ├── InventoryService.java     # Inventory service
│       │   │       ├── MenuService.java          # Menu service
│       │   │       ├── OrderService.java         # Order service
│       │   │       └── UserService.java          # User service
│       │   │
│       │   └── resources/
│       │       ├── application.properties         # Application config
│       │       └── data.sql                       # Seed data
│       │
│       └── test/                                  # Test classes
│
└── frontend/                          # React Frontend
    ├── package.json                   # npm dependencies
    ├── public/
    │   └── index.html                 # HTML template
    │
    └── src/
        ├── index.js                   # React entry point
        ├── index.css                  # Global styles
        ├── App.js                     # Main App component
        │
        ├── components/                # Reusable Components
        │   └── Layout.js              # Layout with navigation
        │
        ├── context/                   # React Context
        │   └── AuthContext.js         # Authentication context
        │
        ├── pages/                     # Page Components
        │   ├── Analytics.js           # Analytics dashboard
        │   ├── BaristaView.js         # Barista kitchen view
        │   ├── Dashboard.js           # Main dashboard
        │   ├── InventoryManagement.js # Inventory management
        │   ├── Login.js               # Login page
        │   ├── MenuManagement.js      # Menu management
        │   ├── POS.js                 # Point of Sale
        │   └── UserManagement.js      # User management
        │
        └── services/                  # API Services
            └── api.js                 # API client & services
```

## Key Directories Explained

### Backend

**config/**: Application configuration including security, Swagger, and data initialization

**controller/**: REST API endpoints organized by domain (users, orders, menu, etc.)

**dto/**: Data Transfer Objects for API requests/responses, separate from entities

**entity/**: JPA entities representing database tables with relationships

**exception/**: Centralized exception handling for consistent error responses

**repository/**: Spring Data JPA repositories for database operations

**security/**: JWT authentication and authorization components

**service/**: Business logic layer between controllers and repositories

### Frontend

**components/**: Reusable React components (Layout, etc.)

**context/**: React Context for global state (authentication)

**pages/**: Full page components for each route

**services/**: API client and service functions for backend communication

## Architecture Layers

### Backend (3-Tier Architecture)

1. **Presentation Layer** (Controller)
   - Handles HTTP requests/responses
   - Input validation
   - Maps DTOs to/from entities

2. **Business Logic Layer** (Service)
   - Core business rules
   - Transaction management
   - Data transformation

3. **Data Access Layer** (Repository)
   - Database operations
   - Query execution
   - Entity management

### Frontend (Component-Based)

1. **Pages**: Full-page components with routing
2. **Components**: Reusable UI components
3. **Services**: API communication layer
4. **Context**: Global state management

## Design Patterns Used

- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Separate API contracts from entities
- **Service Layer Pattern**: Business logic encapsulation
- **Dependency Injection**: Spring IoC container
- **JWT Authentication**: Stateless authentication
- **RESTful API**: Standard HTTP methods and status codes
- **Context API**: React state management
- **Component Composition**: React component architecture

## Technology Stack Summary

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Swagger/OpenAPI

### Frontend
- React 18
- Material-UI (MUI)
- React Router
- Axios
- Recharts
- Context API

## Key Features by Module

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- BCrypt password hashing

### User Management
- CRUD operations for users
- Role assignment
- Active/inactive status

### Menu Management
- Menu items with categories
- Ingredient mapping
- Active/inactive items

### Order Management (POS)
- Create orders with multiple items
- Order status workflow
- Payment processing
- Order cancellation

### Barista View
- Real-time order display
- Status updates
- Kitchen order tracking (KOT)

### Inventory Management
- Stock tracking
- Low stock alerts
- Automatic deduction on order completion
- Purchase entries

### Analytics & Reporting
- Sales summary (daily/weekly/monthly)
- Top-selling items
- Staff performance metrics
- Inventory usage tracking
