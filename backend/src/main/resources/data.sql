-- Note: Roles and Users are initialized via DataInitializer.java

-- Insert Categories
MERGE INTO categories (id, name, description) VALUES (1, 'Coffee', 'Hot and cold coffee beverages');
MERGE INTO categories (id, name, description) VALUES (2, 'Snacks', 'Pastries and snacks');
MERGE INTO categories (id, name, description) VALUES (3, 'Beverages', 'Non-coffee beverages');
MERGE INTO categories (id, name, description) VALUES (4, 'Add-ons', 'Extra items and toppings');
MERGE INTO categories (id, name, description) VALUES (5, 'Seasonal', 'Seasonal specials');

-- Insert Inventory Items
MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (1, 'Milk', 'ml', 10000.00, 1000.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (2, 'Espresso Beans', 'g', 5000.00, 500.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (3, 'Sugar', 'g', 3000.00, 500.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (4, 'Chocolate Syrup', 'ml', 2000.00, 200.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (5, 'Whipped Cream', 'g', 1000.00, 100.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (6, 'Croissant', 'pcs', 50.00, 10.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (7, 'Tea Bags', 'pcs', 100.00, 20.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (8, 'Caramel Syrup', 'ml', 1500.00, 200.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (9, 'Vanilla Syrup', 'ml', 1500.00, 200.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (10, 'Muffins', 'pcs', 40.00, 10.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (11, 'Bagels', 'pcs', 30.00, 10.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (12, 'Cream Cheese', 'g', 1000.00, 200.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (13, 'Cake Slices', 'pcs', 20.00, 5.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (14, 'Cookies', 'pcs', 60.00, 15.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (15, 'Brownies', 'pcs', 25.00, 8.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (16, 'Orange Juice', 'ml', 3000.00, 500.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (17, 'Mixed Berries', 'g', 2000.00, 300.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO inventory_items (id, name, unit, current_stock, reorder_level, created_at, updated_at) 
VALUES (18, 'Ice', 'g', 5000.00, 1000.00, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Menu Items

-- Coffee Category (1) - Prices in Indian Rupees
MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (1, 'Espresso', 1, 120.00, 'Strong and bold espresso shot', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (2, 'Latte', 1, 150.00, 'Smooth espresso with steamed milk', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (3, 'Cappuccino', 1, 150.00, 'Espresso with foamed milk', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (4, 'Mocha', 1, 180.00, 'Chocolate espresso with milk', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (7, 'Americano', 1, 130.00, 'Espresso with hot water', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (8, 'Flat White', 1, 160.00, 'Velvety microfoam with espresso', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (9, 'Macchiato', 1, 140.00, 'Espresso marked with foam', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (10, 'Iced Coffee', 1, 145.00, 'Cold brew over ice', 'https://images.unsplash.com/photo-1461023058943-07fbe153f4f5?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (11, 'Caramel Latte', 1, 180.00, 'Latte with caramel syrup', 'https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (12, 'Vanilla Latte', 1, 180.00, 'Latte with vanilla flavor', 'https://images.unsplash.com/photo-1578374173705-0a5c2c1e8b72?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Snacks Category (2)
MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (5, 'Croissant', 2, 3.00, 'Buttery flaky croissant', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (13, 'Chocolate Muffin', 2, 3.50, 'Rich chocolate chip muffin', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (14, 'Blueberry Muffin', 2, 3.50, 'Fresh blueberry muffin', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (15, 'Bagel with Cream Cheese', 2, 4.00, 'Toasted bagel with cream cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (16, 'Chocolate Cake', 2, 4.50, 'Decadent chocolate cake slice', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (17, 'Cheesecake', 2, 5.00, 'Creamy New York cheesecake', 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (18, 'Cookies', 2, 2.50, 'Freshly baked cookies (3 pcs)', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (19, 'Brownie', 2, 3.75, 'Fudgy chocolate brownie', 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Beverages Category (3)
MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (6, 'Green Tea', 3, 2.50, 'Fresh green tea', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (20, 'Black Tea', 3, 2.50, 'Classic black tea', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (21, 'Chai Latte', 3, 4.00, 'Spiced chai with steamed milk', 'https://images.unsplash.com/photo-1578899952107-9d9d7d96e8c3?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (22, 'Hot Chocolate', 3, 3.75, 'Rich hot chocolate', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (23, 'Fresh Orange Juice', 3, 4.50, 'Freshly squeezed orange juice', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (24, 'Smoothie', 3, 5.50, 'Mixed berry smoothie', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (25, 'Iced Tea', 3, 3.50, 'Refreshing iced tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Add-ons Category (4)
MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (26, 'Extra Shot', 4, 0.75, 'Additional espresso shot', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (27, 'Whipped Cream', 4, 0.50, 'Extra whipped cream', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (28, 'Flavor Syrup', 4, 0.75, 'Vanilla, Caramel, or Hazelnut', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Seasonal Category (5)
MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (29, 'Pumpkin Spice Latte', 5, 5.75, 'Seasonal pumpkin spice latte', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

MERGE INTO menu_items (id, name, category_id, price, description, image_url, active, created_at, updated_at) 
VALUES (30, 'Peppermint Mocha', 5, 5.75, 'Holiday peppermint mocha', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Menu Ingredients (Recipe mapping)
MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (1, 1, 2, 18.00); -- Espresso needs 18g beans

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (2, 2, 2, 18.00); -- Latte needs 18g beans

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (3, 2, 1, 200.00); -- Latte needs 200ml milk

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (4, 3, 2, 18.00); -- Cappuccino needs 18g beans

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (5, 3, 1, 150.00); -- Cappuccino needs 150ml milk

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (6, 4, 2, 18.00); -- Mocha needs 18g beans

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (7, 4, 1, 200.00); -- Mocha needs 200ml milk

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (8, 4, 4, 30.00); -- Mocha needs 30ml chocolate syrup

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (9, 5, 6, 1.00); -- Croissant needs 1 piece

MERGE INTO menu_ingredients (id, menu_item_id, inventory_item_id, quantity_required) 
VALUES (10, 6, 7, 1.00); -- Green Tea needs 1 tea bag
