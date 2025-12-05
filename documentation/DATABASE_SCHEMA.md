# Database Schema

## Tables

### users
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL
- `email` VARCHAR(255) NOT NULL UNIQUE
- `password` VARCHAR(255) NOT NULL
- `active` BOOLEAN NOT NULL DEFAULT TRUE
- `created_at` TIMESTAMP NOT NULL
- `updated_at` TIMESTAMP

**Indexes:**
- `idx_email` on `email`

### roles
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(50) NOT NULL UNIQUE (ENUM: ROLE_ADMIN, ROLE_CASHIER, ROLE_BARISTA, ROLE_INVENTORY_MANAGER)

### user_roles
- `user_id` BIGINT FOREIGN KEY -> users(id)
- `role_id` BIGINT FOREIGN KEY -> roles(id)
- PRIMARY KEY (`user_id`, `role_id`)

### categories
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL UNIQUE
- `description` VARCHAR(500)

### menu_items
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL
- `category_id` BIGINT NOT NULL FOREIGN KEY -> categories(id)
- `price` DECIMAL(10,2) NOT NULL
- `description` VARCHAR(1000)
- `image_url` VARCHAR(500)
- `active` BOOLEAN NOT NULL DEFAULT TRUE
- `created_at` TIMESTAMP NOT NULL
- `updated_at` TIMESTAMP

**Indexes:**
- `idx_category` on `category_id`
- `idx_active` on `active`

### inventory_items
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL UNIQUE
- `unit` VARCHAR(50) NOT NULL (ml, g, pcs)
- `current_stock` DECIMAL(10,2) NOT NULL DEFAULT 0
- `reorder_level` DECIMAL(10,2) NOT NULL
- `created_at` TIMESTAMP NOT NULL
- `updated_at` TIMESTAMP

**Indexes:**
- `idx_stock_level` on `current_stock`

### menu_ingredients
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `menu_item_id` BIGINT NOT NULL FOREIGN KEY -> menu_items(id)
- `inventory_item_id` BIGINT NOT NULL FOREIGN KEY -> inventory_items(id)
- `quantity_required` DECIMAL(10,2) NOT NULL

### orders
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `cashier_id` BIGINT NOT NULL FOREIGN KEY -> users(id)
- `status` VARCHAR(50) NOT NULL (ENUM: CREATED, IN_PREPARATION, READY, COMPLETED, CANCELLED)
- `subtotal` DECIMAL(10,2) DEFAULT 0
- `discount` DECIMAL(10,2) DEFAULT 0
- `tax` DECIMAL(10,2) DEFAULT 0
- `total` DECIMAL(10,2) NOT NULL
- `coupon_code` VARCHAR(100)
- `cancellation_reason` VARCHAR(500)
- `created_at` TIMESTAMP NOT NULL
- `updated_at` TIMESTAMP
- `completed_at` TIMESTAMP

**Indexes:**
- `idx_order_date` on `created_at`
- `idx_status` on `status`
- `idx_cashier` on `cashier_id`

### order_items
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `order_id` BIGINT NOT NULL FOREIGN KEY -> orders(id)
- `menu_item_id` BIGINT NOT NULL FOREIGN KEY -> menu_items(id)
- `quantity` INT NOT NULL
- `price` DECIMAL(10,2) NOT NULL
- `subtotal` DECIMAL(10,2) NOT NULL

### payments
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `order_id` BIGINT NOT NULL FOREIGN KEY -> orders(id)
- `method` VARCHAR(50) NOT NULL (ENUM: CASH, UPI, CARD)
- `amount` DECIMAL(10,2) NOT NULL
- `paid_at` TIMESTAMP NOT NULL
- `transaction_id` VARCHAR(255)

### inventory_usage
- `id` BIGINT PRIMARY KEY AUTO_INCREMENT
- `order_id` BIGINT NOT NULL FOREIGN KEY -> orders(id)
- `inventory_item_id` BIGINT NOT NULL FOREIGN KEY -> inventory_items(id)
- `quantity_used` DECIMAL(10,2) NOT NULL
- `used_at` TIMESTAMP NOT NULL

**Indexes:**
- `idx_usage_date` on `used_at`

## Relationships

1. **Users ↔ Roles**: Many-to-Many through `user_roles`
2. **Menu Items → Categories**: Many-to-One
3. **Menu Items ↔ Inventory Items**: Many-to-Many through `menu_ingredients`
4. **Orders → Users (Cashier)**: Many-to-One
5. **Orders ↔ Menu Items**: Many-to-Many through `order_items`
6. **Orders → Payments**: One-to-One
7. **Orders ↔ Inventory Items**: Many-to-Many through `inventory_usage`

## Key Features

- **Automatic Timestamps**: Using JPA auditing for `created_at` and `updated_at`
- **Cascading**: Order items and payments cascade with orders
- **Indexing**: Strategic indexes on frequently queried columns
- **Constraints**: Foreign keys ensure referential integrity
- **Enums**: Type-safe enumerations for roles, order status, and payment methods
