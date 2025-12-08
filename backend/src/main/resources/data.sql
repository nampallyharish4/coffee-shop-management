-- Disable FK checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;

-- Drop Triggers (Cleanup legacy)
DROP TRIGGER IF EXISTS after_order_item_insert;

-- Clean existing data
TRUNCATE TABLE payments;
TRUNCATE TABLE inventory_usage;
TRUNCATE TABLE menu_ingredients;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE inventory_items;
TRUNCATE TABLE categories;

-- SECTION A: Categories (10 Items)
INSERT INTO categories (id, name, description) VALUES
(1, 'Hot Coffee', 'Classic heated coffee beverages'),
(2, 'Cold Coffee', 'Refreshing cold coffee drinks'),
(3, 'Chai & Tea', 'Traditional Indian chai and herbal teas'),
(4, 'Shakes & Smoothies', 'Thick fruit and chocolate blends'),
(5, 'Coolers & Mojitos', 'Icy refreshing mocktails'),
(6, 'Quick Bites', 'Finger foods and snacks'),
(7, 'Sandwiches & Toasties', 'Grilled and toasted sandwiches'),
(8, 'Burgers & Wraps', 'Hearty meals on the go'),
(9, 'Pastas & Bowls', 'Italian pastas and noodle bowls'),
(10, 'Desserts & Bakery', 'Sweet treats and baked goods');

-- SECTION C: Inventory Items (45 Items)
INSERT INTO inventory_items (id, name, unit, current_stock, reorder_level, unit_price, created_at, updated_at) VALUES
(1, 'Espresso Coffee Beans', 'g', 5000.00, 1000.00, 2.00, NOW(), NOW()),
(2, 'Black Tea Leaves', 'g', 2000.00, 500.00, 1.00, NOW(), NOW()),
(3, 'Green Tea Bags', 'pcs', 200.00, 50.00, 5.00, NOW(), NOW()),
(4, 'Chai Masala Premix', 'g', 1000.00, 200.00, 1.50, NOW(), NOW()),
(5, 'Cocoa Powder', 'g', 1500.00, 300.00, 1.20, NOW(), NOW()),
(6, 'Full Cream Milk', 'ml', 20000.00, 5000.00, 0.10, NOW(), NOW()),
(7, 'Vanilla Ice Cream', 'ml', 5000.00, 1000.00, 0.50, NOW(), NOW()),
(8, 'Whipped Cream', 'g', 2000.00, 500.00, 0.80, NOW(), NOW()),
(9, 'Amul Butter', 'g', 1000.00, 200.00, 0.60, NOW(), NOW()),
(10, 'Cheese Slice', 'pcs', 500.00, 100.00, 10.00, NOW(), NOW()),
(11, 'Mozzarella Cheese', 'g', 3000.00, 500.00, 0.90, NOW(), NOW()),
(12, 'Sugar', 'g', 10000.00, 2000.00, 0.05, NOW(), NOW()),
(13, 'Chocolate Sauce', 'ml', 3000.00, 500.00, 0.60, NOW(), NOW()),
(14, 'Caramel Syrup', 'ml', 2000.00, 500.00, 0.70, NOW(), NOW()),
(15, 'Hazelnut Syrup', 'ml', 2000.00, 500.00, 0.80, NOW(), NOW()),
(16, 'Vanilla Syrup', 'ml', 2000.00, 500.00, 0.70, NOW(), NOW()),
(17, 'Strawberry Crush', 'ml', 1500.00, 300.00, 0.50, NOW(), NOW()),
(18, 'Mint Mojito Syrup', 'ml', 1500.00, 300.00, 0.50, NOW(), NOW()),
(19, 'Burger Bun', 'pcs', 100.00, 20.00, 5.00, NOW(), NOW()),
(20, 'Jumbo Bread Slice', 'pcs', 200.00, 50.00, 3.00, NOW(), NOW()),
(21, 'Tortilla Wrap', 'pcs', 100.00, 20.00, 8.00, NOW(), NOW()),
(22, 'Pizza Base (Small)', 'pcs', 50.00, 10.00, 15.00, NOW(), NOW()),
(23, 'Croissant Dough', 'pcs', 50.00, 10.00, 20.00, NOW(), NOW()),
(24, 'Paneer Block', 'g', 3000.00, 500.00, 0.60, NOW(), NOW()),
(25, 'Frozen Veg Patty', 'pcs', 100.00, 20.00, 12.00, NOW(), NOW()),
(26, 'Frozen Chicken Patty', 'pcs', 100.00, 20.00, 18.00, NOW(), NOW()),
(27, 'Frozen French Fries', 'g', 10000.00, 2000.00, 0.30, NOW(), NOW()),
(28, 'Frozen Nuggets (Veg)', 'pcs', 500.00, 100.00, 4.00, NOW(), NOW()),
(29, 'Frozen Nuggets (Chicken)', 'pcs', 500.00, 100.00, 6.00, NOW(), NOW()),
(30, 'Potato Wedges', 'g', 3000.00, 500.00, 0.40, NOW(), NOW()),
(31, 'Onion', 'g', 5000.00, 1000.00, 0.04, NOW(), NOW()),
(32, 'Tomato', 'g', 5000.00, 1000.00, 0.05, NOW(), NOW()),
(33, 'Capsicum', 'g', 3000.00, 500.00, 0.08, NOW(), NOW()),
(34, 'Lettuce leaves', 'pcs', 200.00, 50.00, 2.00, NOW(), NOW()),
(35, 'Maggi Noodles Cake', 'pcs', 200.00, 50.00, 10.00, NOW(), NOW()),
(36, 'Penne Pasta (Dry)', 'g', 5000.00, 1000.00, 0.20, NOW(), NOW()),
(37, 'Spaghetti (Dry)', 'g', 3000.00, 1000.00, 0.20, NOW(), NOW()),
(38, 'White Sauce Premix', 'g', 2000.00, 500.00, 0.80, NOW(), NOW()),
(39, 'Red Pasta Sauce', 'g', 3000.00, 500.00, 0.60, NOW(), NOW()),
(40, 'Eggless Mayonnaise', 'g', 4000.00, 1000.00, 0.30, NOW(), NOW()),
(41, 'Tomato Ketchup', 'g', 4000.00, 1000.00, 0.20, NOW(), NOW()),
(42, 'Peri Peri Spice Mix', 'g', 1000.00, 200.00, 1.00, NOW(), NOW()),
(43, 'Oregano Seasoning', 'g', 500.00, 100.00, 2.00, NOW(), NOW()),
(44, 'Chilly Flakes', 'g', 500.00, 100.00, 2.00, NOW(), NOW()),
(45, 'Salt', 'g', 2000.00, 500.00, 0.02, NOW(), NOW());

-- SECTION B: Menu Items (100 Items)
INSERT INTO menu_items (id, active, created_at, description, image_url, name, price, updated_at, category_id) VALUES
(1, b'1', NOW(), 'Rich and intense shot of pure roasted coffee.', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80', 'Classic Espresso', 120.00, NOW(), 1),
(2, b'1', NOW(), 'Espresso diluted with hot water for a smooth taste.', 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=800&q=80', 'Americano', 140.00, NOW(), 1),
(3, b'1', NOW(), 'Espresso topped with frothy steamed milk.', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', 'Cappuccino', 160.00, NOW(), 1),
(4, b'1', NOW(), 'Creamy milk coffee with a light layer of foam.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', 'Cafe Latte', 170.00, NOW(), 1),
(5, b'1', NOW(), 'Chocolate flavored warm coffee topped with cocoa.', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80', 'Cafe Mocha', 190.00, NOW(), 1),
(6, b'1', NOW(), 'Classic cappuccino with sweet hazelnut syrup.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 'Hazelnut Cappuccino', 210.00, NOW(), 1),
(7, b'1', NOW(), 'Rich caramel blended with creamy latte.', 'https://images.unsplash.com/photo-1485808191679-5f8c7c83563e?auto=format&fit=crop&w=800&q=80', 'Caramel Macchiato', 220.00, NOW(), 1),
(8, b'1', NOW(), 'Strong espresso with a small amount of warm milk.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', 'Cortado', 150.00, NOW(), 1),
(9, b'1', NOW(), 'Micro-foamed milk poured over a double shot.', 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80', 'Flat White', 180.00, NOW(), 1),
(10, b'1', NOW(), 'Classic coffee with a hint of Irish whiskey flavor (non-alcoholic).', 'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=800&q=80', 'Irish Coffee', 200.00, NOW(), 1),
(11, b'1', NOW(), 'Signature cold coffee blended with ice cream.', 'https://images.unsplash.com/photo-1517701604599-bb29b5dd73ad?auto=format&fit=crop&w=800&q=80', 'Classic Cold Coffee', 180.00, NOW(), 2),
(12, b'1', NOW(), 'Chilled espresso with water and ice.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', 'Iced Americano', 150.00, NOW(), 2),
(13, b'1', NOW(), 'Cold milk coffee served over ice cubes.', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', 'Iced Latte', 170.00, NOW(), 2),
(14, b'1', NOW(), 'Thick blended coffee with chocolate sauce.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Chocolate Frappe', 220.00, NOW(), 2),
(15, b'1', NOW(), 'Blended hazelnut coffee topped with whipped cream.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Hazelnut Frappe', 230.00, NOW(), 2),
(16, b'1', NOW(), 'Cold coffee blended with crushed Oreo cookies.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Oreo Cookie Frappe', 240.00, NOW(), 2),
(17, b'1', NOW(), 'Rich brownie chunks blended into cold coffee.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Brownie Blast Frappe', 250.00, NOW(), 2),
(18, b'1', NOW(), 'Sweet caramel blended cold coffee.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Caramel Frappe', 230.00, NOW(), 2),
(19, b'1', NOW(), 'Steeped for 18 hours for a smooth finish.', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', 'Nitro Cold Brew', 200.00, NOW(), 2),
(20, b'1', NOW(), 'Cold coffee with a scoop of vanilla ice cream.', 'https://images.unsplash.com/photo-1517701604599-bb29b5dd73ad?auto=format&fit=crop&w=800&q=80', 'Coffee Float', 210.00, NOW(), 2),
(21, b'1', NOW(), 'Traditional Indian spiced tea boiled with milk.', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80', 'Masala Chai', 90.00, NOW(), 3),
(22, b'1', NOW(), 'Fresh ginger infused milk tea.', 'https://images.unsplash.com/photo-1564890369-45a436a7ed20?auto=format&fit=crop&w=800&q=80', 'Adrak Chai', 100.00, NOW(), 3),
(23, b'1', NOW(), 'Cardamom flavored refreshing milk tea.', 'https://images.unsplash.com/photo-1576092762791-2d9a6a8e5c8e?auto=format&fit=crop&w=800&q=80', 'Elaichi Chai', 100.00, NOW(), 3),
(24, b'1', NOW(), 'Saffron infused premium milk tea.', 'https://images.unsplash.com/photo-1564890369-45a436a7ed20?auto=format&fit=crop&w=800&q=80', 'Kesar Chai', 130.00, NOW(), 3),
(25, b'1', NOW(), 'Healthy antioxidant rich green tea.', 'https://images.unsplash.com/photo-1627435601361-ec25488c30d7?auto=format&fit=crop&w=800&q=80', 'Classic Green Tea', 110.00, NOW(), 3),
(26, b'1', NOW(), 'Refreshing lemon infused black tea.', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', 'Lemon Honey Tea', 120.00, NOW(), 3),
(27, b'1', NOW(), 'Soothing chamomile flower tea.', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80', 'Chamomile Tea', 140.00, NOW(), 3),
(28, b'1', NOW(), 'Aromatic Earl Grey black tea.', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', 'Earl Grey Tea', 140.00, NOW(), 3),
(29, b'1', NOW(), 'Kashmiri style tea with almonds and spices.', 'https://images.unsplash.com/photo-1576092762791-2d9a6a8e5c8e?auto=format&fit=crop&w=800&q=80', 'Kashmiri Kahwa', 160.00, NOW(), 3),
(30, b'1', NOW(), 'Rich creamy hot chocolate with marshmallows.', 'https://images.unsplash.com/photo-1542990253-0d0f55342c64?auto=format&fit=crop&w=800&q=80', 'Belgian Hot Chocolate', 220.00, NOW(), 3),
(31, b'1', NOW(), 'Thick vanilla milkshake.', 'https://images.unsplash.com/photo-1579954115545-a95591f28df8?auto=format&fit=crop&w=800&q=80', 'Classic Vanilla Shake', 180.00, NOW(), 4),
(32, b'1', NOW(), 'Rich chocolate milkshake.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Double Chocolate Shake', 200.00, NOW(), 4),
(33, b'1', NOW(), 'Fresh strawberry blended shake.', 'https://images.unsplash.com/photo-1579954115545-a95591f28df8?auto=format&fit=crop&w=800&q=80', 'Strawberry Shake', 190.00, NOW(), 4),
(34, b'1', NOW(), 'Crunchy KitKat chocolate blended shake.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'KitKat Shake', 220.00, NOW(), 4),
(35, b'1', NOW(), 'Oreo cookies blended with vanilla ice cream.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Oreo Shake', 220.00, NOW(), 4),
(36, b'1', NOW(), 'Healthy yogurt based mango drink.', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 'Mango Lassi / Smoothie', 180.00, NOW(), 4),
(37, b'1', NOW(), 'Mixed berry smoothie bowl.', 'https://images.unsplash.com/photo-1553530666-ba11a9061b3b?auto=format&fit=crop&w=800&q=80', 'Berry Blast Smoothie', 240.00, NOW(), 4),
(38, b'1', NOW(), 'Ferrero Rocher hazelnut chocolate shake.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Ferrero Rocher Shake', 280.00, NOW(), 4),
(39, b'1', NOW(), 'Peanut Butter banana blend.', 'https://images.unsplash.com/photo-1553530666-ba11a9061b3b?auto=format&fit=crop&w=800&q=80', 'Peanut Butter Banana Shake', 210.00, NOW(), 4),
(40, b'1', NOW(), 'Cold Bournvita nostalgia shake.', 'https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&w=800&q=80', 'Chilled Bournvita Shake', 170.00, NOW(), 4),
(41, b'1', NOW(), 'Mint and lemon sparkling cooler.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Virgin Mojito', 160.00, NOW(), 5),
(42, b'1', NOW(), 'Blue curacao citrus cooler.', 'https://images.unsplash.com/photo-1536935338788-843bb52b364c?auto=format&fit=crop&w=800&q=80', 'Blue Lagoon', 170.00, NOW(), 5),
(43, b'1', NOW(), 'Sweet and icy watermelon slush.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', 'Fresh Watermelon Cooler', 150.00, NOW(), 5),
(44, b'1', NOW(), 'Spicy guava drink with chili rim.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Spicy Guava', 180.00, NOW(), 5),
(45, b'1', NOW(), 'Classic lemon ice tea.', 'https://images.unsplash.com/photo-1499638472904-ea5c6178a300?auto=format&fit=crop&w=800&q=80', 'Peach Iced Tea', 160.00, NOW(), 5),
(46, b'1', NOW(), 'Lemon iced tea with mint.', 'https://images.unsplash.com/photo-1499638472904-ea5c6178a300?auto=format&fit=crop&w=800&q=80', 'Lemon Iced Tea', 160.00, NOW(), 5),
(47, b'1', NOW(), 'Sparkling green apple soda.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Green Apple Soda', 150.00, NOW(), 5),
(48, b'1', NOW(), 'Indian style masala lemonade.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Masala Lemonade (Shikanji)', 120.00, NOW(), 5),
(49, b'1', NOW(), 'Fresh pineapple and coconut blend.', 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80', 'Virgin Pina Colada', 200.00, NOW(), 5),
(50, b'1', NOW(), 'Refreshing cucumber and mint cooler.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Cucumber Mint Cooler', 160.00, NOW(), 5),
(51, b'1', NOW(), 'Crispy salted french fries.', 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=800&q=80', 'Classic Salted Fries', 130.00, NOW(), 6),
(52, b'1', NOW(), 'Fries tossed in spicy Peri Peri seasoning.', 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=800&q=80', 'Peri Peri Fries', 150.00, NOW(), 6),
(53, b'1', NOW(), 'Fries topped with melted cheese sauce.', 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=800&q=80', 'Cheesy Fries', 180.00, NOW(), 6),
(54, b'1', NOW(), 'Spiced potato wedges served with dip.', 'https://images.unsplash.com/photo-1623238910087-8ca93aa95dfb?auto=format&fit=crop&w=800&q=80', 'Potato Wedges', 160.00, NOW(), 6),
(55, b'1', NOW(), 'Toasted bread with garlic butter and herbs.', 'https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&w=800&q=80', 'Garlic Bread', 140.00, NOW(), 6),
(56, b'1', NOW(), 'Garlic bread topped with mozzarella.', 'https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&w=800&q=80', 'Cheese Garlic Bread', 180.00, NOW(), 6),
(57, b'1', NOW(), 'Deep fried vegetable nuggets.', 'https://images.unsplash.com/photo-1562967914-608f22436d6a?auto=format&fit=crop&w=800&q=80', 'Veg Nuggets (8pcs)', 150.00, NOW(), 6),
(58, b'1', NOW(), 'Crispy fried chicken nuggets.', 'https://images.unsplash.com/photo-1562967914-608f22436d6a?auto=format&fit=crop&w=800&q=80', 'Chicken Nuggets (6pcs)', 200.00, NOW(), 6),
(59, b'1', NOW(), 'Crispy onion rings.', 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80', 'Onion Rings', 160.00, NOW(), 6),
(60, b'1', NOW(), 'Spicy chilly cheese toast.', 'https://images.unsplash.com/photo-1584776293029-41256d15354d?auto=format&fit=crop&w=800&q=80', 'Chilly Cheese Toast', 170.00, NOW(), 6),
(61, b'1', NOW(), 'Vegetables and chutney grilled sandwich.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Mumbai Masala Sandwich', 160.00, NOW(), 7),
(62, b'1', NOW(), 'Classic coleslaw and veg sandwich.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Veg Cole Slaw Sandwich', 150.00, NOW(), 7),
(63, b'1', NOW(), 'Spiced paneer filling grilled to perfection.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Tandoori Paneer Sandwich', 200.00, NOW(), 7),
(64, b'1', NOW(), 'Corn and spinach with cheese.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Corn & Spinach Sandwich', 190.00, NOW(), 7),
(65, b'1', NOW(), 'Grilled chicken with mayo and lettuce.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Chicken Mayo Sandwich', 220.00, NOW(), 7),
(66, b'1', NOW(), 'Spicy tikka chicken sandwich.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Chicken Tikka Sandwich', 240.00, NOW(), 7),
(67, b'1', NOW(), 'Triple layer sandwich with veg and cheese.', 'https://images.unsplash.com/photo-1567234669003-dce7a7a8885f?auto=format&fit=crop&w=800&q=80', 'Veg Club Sandwich', 230.00, NOW(), 7),
(68, b'1', NOW(), 'Classic triple layer chicken club.', 'https://images.unsplash.com/photo-1567234669003-dce7a7a8885f?auto=format&fit=crop&w=800&q=80', 'Non-Veg Club Sandwich', 260.00, NOW(), 7),
(69, b'1', NOW(), 'Simply melted cheese between toast.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 'Grilled Cheese Sandwich', 180.00, NOW(), 7),
(70, b'1', NOW(), 'Open toast with mushrooms and cheese.', 'https://images.unsplash.com/photo-1584776293029-41256d15354d?auto=format&fit=crop&w=800&q=80', 'Mushroom Cheese Toast', 210.00, NOW(), 7),
(71, b'1', NOW(), 'Classic veg aloo tikki burger.', 'https://images.unsplash.com/photo-1550547660-d94952562c0b?auto=format&fit=crop&w=800&q=80', 'Classic Veg Burger', 150.00, NOW(), 8),
(72, b'1', NOW(), 'Crispy fried paneer patty burger.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Crispy Paneer Burger', 190.00, NOW(), 8),
(73, b'1', NOW(), 'Spicy peri peri sauce vegetable burger.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Peri Peri Veg Burger', 170.00, NOW(), 8),
(74, b'1', NOW(), 'Breaded chicken patty with mayo.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Classic Chicken Burger', 210.00, NOW(), 8),
(75, b'1', NOW(), 'Spicy tandoori chicken burger.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Tandoori Chicken Burger', 230.00, NOW(), 8),
(76, b'1', NOW(), 'Double patty chicken burger.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Mighty Chicken Burger', 280.00, NOW(), 8),
(77, b'1', NOW(), 'Grilled tortilla wrap with spiced veggies.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', 'Veggie Wrap', 180.00, NOW(), 8),
(78, b'1', NOW(), 'Spicy paneer chunks in a wrap.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', 'Paneer Tikka Wrap', 210.00, NOW(), 8),
(79, b'1', NOW(), 'Juicy chicken pieces wrapped in tortilla.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', 'Chicken Tikka Wrap', 240.00, NOW(), 8),
(80, b'1', NOW(), 'Mexican style bean and salsa wrap.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', 'Mexican Burrito Wrap', 220.00, NOW(), 8),
(81, b'1', NOW(), 'Classic 2-minute noodles with veggies.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80', 'Vegetable Maggi', 100.00, NOW(), 9),
(82, b'1', NOW(), 'Maggi topped with melted cheese.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', 'Cheese Maggi', 130.00, NOW(), 9),
(83, b'1', NOW(), 'Spicy schezwan flavor Maggi.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80', 'Schezwan Maggi', 120.00, NOW(), 9),
(84, b'1', NOW(), 'Maggi with butter and scrambled egg.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80', 'Egg Maggi', 140.00, NOW(), 9),
(85, b'1', NOW(), 'Penne pasta in spicy red arrabbiata sauce.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'Penne Arrabbiata (Red)', 260.00, NOW(), 9),
(86, b'1', NOW(), 'Penne pasta in creamy white cheesy sauce.', 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80', 'Penne Alfredo (White)', 280.00, NOW(), 9),
(87, b'1', NOW(), 'Mix of red and white sauce pasta.', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', 'Pink Sauce Pasta', 290.00, NOW(), 9),
(88, b'1', NOW(), 'Spaghetti tossed in olive oil and garlic.', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', 'Spaghetti Aglio e Olio', 270.00, NOW(), 9),
(89, b'1', NOW(), 'Baked macaroni with cheese crust.', 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80', 'Baked Mac & Cheese', 300.00, NOW(), 9),
(90, b'1', NOW(), 'Rice bowl with paneer makhani.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 'Paneer Makhani Rice Bowl', 250.00, NOW(), 9),
(91, b'1', NOW(), 'Warm walnut brownie.', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80', 'Walnut Brownie', 150.00, NOW(), 10),
(92, b'1', NOW(), 'Brownie served with vanilla ice cream.', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80', 'Sizzling Brownie', 220.00, NOW(), 10),
(93, b'1', NOW(), 'Classic New York style cheesecake slice.', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', 'Blueberry Cheesecake', 250.00, NOW(), 10),
(94, b'1', NOW(), 'Rich chocolate truffle pastry.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 'Choco Truffle Pastry', 180.00, NOW(), 10),
(95, b'1', NOW(), 'Red velvet cake slice.', 'https://images.unsplash.com/photo-1586788224331-9a4f09a8f668?auto=format&fit=crop&w=800&q=80', 'Red Velvet Slice', 200.00, NOW(), 10),
(96, b'1', NOW(), 'Belgian waffle with chocolate sauce.', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80', 'Chocolate Waffle', 210.00, NOW(), 10),
(97, b'1', NOW(), 'Waffle with nutella and strawberries.', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80', 'Nutella Strawberry Waffle', 260.00, NOW(), 10),
(98, b'1', NOW(), 'Warm chocolate cake with molten center.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80', 'Choco Lava Cake', 160.00, NOW(), 10),
(99, b'1', NOW(), 'Butter croissant.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', 'Butter Croissant', 120.00, NOW(), 10),
(100, b'1', NOW(), 'Sweet muffin with chocolate chips.', 'https://images.unsplash.com/photo-1558401391-74402a5c3755?auto=format&fit=crop&w=800&q=80', 'Chocochip Muffin', 110.00, NOW(), 10);

-- SECTION D: Recipes
INSERT INTO menu_ingredients (inventory_item_id, menu_item_id, quantity_required) VALUES
(1, 1, 18.00), (1, 2, 18.00), (1, 3, 18.00), (6, 3, 150.00), (12, 3, 10.00), (1, 4, 18.00), (6, 4, 200.00), (12, 4, 10.00), (1, 5, 18.00), (6, 5, 180.00), (13, 5, 20.00), (1, 6, 18.00), (6, 6, 150.00), (15, 6, 15.00),
(1, 7, 18.00), (6, 7, 150.00), (14, 7, 15.00), (1, 8, 18.00), (6, 8, 100.00), (1, 9, 36.00), (6, 9, 150.00), (1, 10, 18.00), (6, 10, 150.00), (16, 10, 15.00),
(1, 11, 20.00), (6, 11, 200.00), (7, 11, 50.00), (12, 11, 20.00), (1, 12, 18.00), (12, 12, 10.00), (1, 13, 18.00), (6, 13, 150.00), (12, 13, 10.00),
(1, 14, 18.00), (6, 14, 150.00), (13, 14, 30.00), (1, 15, 18.00), (6, 15, 150.00), (15, 15, 20.00), (1, 16, 18.00), (6, 16, 150.00), (13, 16, 20.00),
(1, 17, 18.00), (6, 17, 150.00), (13, 17, 30.00), (1, 18, 18.00), (6, 18, 150.00), (14, 18, 20.00), (1, 19, 30.00), (1, 20, 18.00), (6, 20, 100.00), (7, 20, 60.00),
(2, 21, 5.00), (6, 21, 100.00), (12, 21, 10.00), (4, 21, 2.00), (2, 22, 5.00), (6, 22, 100.00), (12, 22, 10.00), (2, 23, 5.00), (6, 23, 100.00), (12, 23, 10.00),
(2, 24, 5.00), (6, 24, 100.00), (12, 24, 10.00), (3, 25, 1.00), (2, 26, 5.00), (12, 26, 20.00), (3, 27, 1.00), (3, 28, 1.00), (6, 28, 10.00),
(2, 29, 5.00), (12, 29, 10.00), (5, 30, 30.00), (6, 30, 200.00), (12, 30, 20.00),
(6, 31, 200.00), (7, 31, 100.00), (16, 31, 20.00), (6, 32, 200.00), (7, 32, 100.00), (13, 32, 30.00), (6, 33, 200.00), (7, 33, 100.00), (17, 33, 30.00),
(6, 34, 200.00), (7, 34, 100.00), (13, 34, 20.00), (6, 35, 200.00), (7, 35, 100.00), (16, 35, 10.00), (6, 36, 150.00), (12, 36, 20.00),
(6, 37, 150.00), (7, 37, 50.00), (17, 37, 40.00), (6, 38, 200.00), (7, 38, 100.00), (13, 38, 40.00), (6, 39, 200.00), (7, 39, 50.00), (12, 39, 10.00), (6, 40, 250.00), (5, 40, 20.00), (12, 40, 10.00),
(18, 41, 30.00), (12, 41, 20.00), (18, 42, 30.00), (12, 42, 10.00), (17, 43, 30.00), (12, 43, 10.00), (17, 44, 30.00), (44, 44, 2.00),
(2, 45, 2.00), (17, 45, 20.00), (2, 46, 2.00), (12, 46, 20.00), (18, 47, 30.00), (12, 48, 20.00), (44, 48, 1.00), (6, 49, 100.00), (16, 49, 20.00), (18, 50, 30.00),
(27, 51, 200.00), (45, 51, 2.00), (27, 52, 200.00), (42, 52, 5.00), (27, 53, 200.00), (40, 53, 30.00), (10, 53, 1.00), (30, 54, 200.00),
(20, 55, 2.00), (9, 55, 10.00), (20, 56, 2.00), (9, 56, 10.00), (11, 56, 30.00), (28, 57, 8.00), (41, 57, 20.00), (29, 58, 6.00), (41, 58, 20.00), (31, 59, 150.00),
(20, 60, 2.00), (10, 60, 1.00), (33, 60, 10.00), (20, 61, 3.00), (9, 61, 20.00), (31, 61, 30.00), (20, 62, 3.00), (40, 62, 30.00),
(20, 63, 3.00), (24, 63, 50.00), (40, 63, 20.00), (20, 64, 3.00), (10, 64, 1.00), (20, 65, 3.00), (26, 65, 1.00), (40, 65, 30.00),
(20, 66, 3.00), (26, 66, 1.00), (42, 66, 5.00), (20, 67, 3.00), (10, 67, 2.00), (32, 67, 30.00), (20, 68, 3.00), (26, 68, 1.00), (10, 68, 1.00),
(20, 69, 2.00), (10, 69, 2.00), (20, 70, 2.00), (11, 70, 30.00), (19, 71, 1.00), (25, 71, 1.00), (34, 71, 1.00), (40, 71, 20.00),
(19, 72, 1.00), (24, 72, 50.00), (34, 72, 1.00), (19, 73, 1.00), (25, 73, 1.00), (42, 73, 5.00), (19, 74, 1.00), (26, 74, 1.00), (40, 74, 20.00),
(19, 75, 1.00), (26, 75, 1.00), (31, 75, 10.00), (19, 76, 1.00), (26, 76, 2.00), (10, 76, 1.00), (21, 77, 1.00), (25, 77, 1.00), (34, 77, 1.00),
(21, 78, 1.00), (24, 78, 50.00), (31, 78, 10.00), (21, 79, 1.00), (26, 79, 1.00), (40, 79, 20.00), (21, 80, 1.00), (41, 80, 20.00), (31, 80, 10.00),
(35, 81, 1.00), (32, 81, 10.00), (35, 82, 1.00), (10, 82, 1.00), (35, 83, 1.00), (42, 83, 10.00), (35, 84, 1.00), (25, 84, 1.00),
(36, 85, 100.00), (39, 85, 50.00), (36, 86, 100.00), (38, 86, 40.00), (6, 86, 50.00), (36, 87, 100.00), (39, 87, 30.00), (38, 87, 30.00),
(37, 88, 100.00), (44, 88, 5.00), (36, 89, 100.00), (10, 89, 2.00), (36, 90, 100.00), (24, 90, 50.00),
(20, 91, 1.00), (13, 91, 20.00), (20, 92, 1.00), (7, 92, 50.00), (13, 92, 20.00), (10, 93, 2.00), (20, 94, 1.00),
(20, 95, 1.00), (23, 96, 1.00), (13, 96, 30.00), (23, 97, 1.00), (15, 97, 30.00), (5, 98, 30.00), (12, 98, 20.00), (23, 99, 1.00), (20, 100, 1.00);

SET FOREIGN_KEY_CHECKS = 1;

-- SECTION F: Sample Orders
INSERT INTO orders (id, created_at, customer_name, status, total_amount, updated_at) VALUES
(1, NOW(), 'Walk-in Customer', 'COMPLETED', 280.00, NOW()),
(2, NOW(), 'Table 5', 'COMPLETED', 340.00, NOW());

INSERT INTO order_items (id, price, quantity, menu_item_id, order_id) VALUES
(1, 120.00, 1, 1, 1), -- Classic Espresso
(2, 160.00, 1, 3, 1), -- Cappuccino
(3, 170.00, 2, 4, 2); -- Cafe Latte (x2)

-- SECTION G: Inventory Usage History (Manually calculated for sample orders)
INSERT INTO inventory_usage (inventory_item_id, order_id, quantity_used, total_cost, used_at) VALUES
(1, 1, 18.00, 36.00, NOW()),
(1, 1, 18.00, 36.00, NOW()),
(6, 1, 150.00, 15.00, NOW()),
(12, 1, 10.00, 0.50, NOW()),
(1, 2, 36.00, 72.00, NOW()),
(6, 2, 400.00, 40.00, NOW()),
(12, 2, 20.00, 1.00, NOW());