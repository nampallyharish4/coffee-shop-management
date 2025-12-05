# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

### POST /auth/login
Login and receive JWT token

**Request:**
```json
{
  "email": "admin@coffeeshop.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "name": "Admin User",
    "email": "admin@coffeeshop.com",
    "roles": ["ROLE_ADMIN"]
  }
}
```

## User Management (Admin Only)

### GET /users
Get all users

### GET /users/{id}
Get user by ID

### POST /users
Create new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "roles": ["ROLE_CASHIER"]
}
```

### PUT /users/{id}
Update user

### DELETE /users/{id}
Delete user

## Menu Management

### GET /menu
Get all menu items

### GET /menu/active
Get active menu items only

### GET /menu/{id}
Get menu item by ID

### POST /menu (Admin Only)
Create menu item

**Request:**
```json
{
  "name": "Cappuccino",
  "categoryId": 1,
  "price": 4.50,
  "description": "Espresso with foamed milk",
  "imageUrl": "https://example.com/cappuccino.jpg",
  "active": true,
  "ingredients": [
    {
      "inventoryItemId": 2,
      "quantityRequired": 18.00
    },
    {
      "inventoryItemId": 1,
      "quantityRequired": 150.00
    }
  ]
}
```

### PUT /menu/{id} (Admin Only)
Update menu item

### DELETE /menu/{id} (Admin Only)
Delete menu item

## Order Management

### GET /orders
Get all orders

### GET /orders/status/{status}
Get orders by status (CREATED, IN_PREPARATION, READY, COMPLETED, CANCELLED)

### GET /orders/{id}
Get order by ID

### POST /orders
Create new order

**Request:**
```json
{
  "items": [
    {
      "menuItemId": 2,
      "quantity": 2
    },
    {
      "menuItemId": 5,
      "quantity": 1
    }
  ],
  "discount": 0,
  "couponCode": null,
  "payment": {
    "method": "CASH",
    "amount": 12.50,
    "transactionId": null
  }
}
```

### PUT /orders/{id}/status
Update order status

**Request:**
```json
{
  "status": "IN_PREPARATION"
}
```

### PUT /orders/{id}/cancel
Cancel order

**Request:**
```json
{
  "reason": "Customer requested cancellation"
}
```

## Inventory Management

### GET /inventory
Get all inventory items

### GET /inventory/low-stock
Get low stock items

### GET /inventory/out-of-stock
Get out of stock items

### GET /inventory/{id}
Get inventory item by ID

### POST /inventory
Create inventory item

**Request:**
```json
{
  "name": "Milk",
  "unit": "ml",
  "currentStock": 5000.00,
  "reorderLevel": 1000.00
}
```

### PUT /inventory/{id}
Update inventory item

### POST /inventory/{id}/add-stock
Add stock to inventory item

**Request:**
```json
{
  "currentStock": 2000.00
}
```

### DELETE /inventory/{id}
Delete inventory item

## Categories

### GET /categories
Get all categories

## Analytics (Admin Only)

### GET /analytics/sales?range={daily|weekly|monthly}
Get sales summary

**Response:**
```json
{
  "success": true,
  "message": "Sales summary retrieved successfully",
  "data": {
    "totalRevenue": 1250.50,
    "orderCount": 45,
    "averageOrderValue": 27.79,
    "period": "daily",
    "startDate": "2024-12-03T00:00:00",
    "endDate": "2024-12-04T00:00:00"
  }
}
```

### GET /analytics/top-items?range={daily|weekly|monthly}
Get top selling items

### GET /analytics/inventory-usage?range={daily|weekly|monthly}
Get inventory usage summary

### GET /analytics/staff-performance?range={daily|weekly|monthly}
Get staff performance metrics

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication

All endpoints except `/auth/login` require JWT token in Authorization header:

```
Authorization: Bearer {token}
```

## Role-Based Access Control

- **ROLE_ADMIN**: Full access to all endpoints
- **ROLE_CASHIER**: Access to menu (read), orders (create, read, update)
- **ROLE_BARISTA**: Access to orders (read, update status)
- **ROLE_INVENTORY_MANAGER**: Access to inventory management
