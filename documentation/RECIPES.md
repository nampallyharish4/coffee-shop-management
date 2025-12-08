# 📋 Café Inventory & Recipe Guide

This document lists all **Menu Items** with their required ingredients and quantities.
This logic is automatically handled by the database trigger: when an order is placed, these exact quantities are deducted from the main inventory.

---

## ☕ 1. Hot Coffee

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 1 | **Classic Espresso** | • 18g Espresso Coffee Beans |
| 2 | **Americano** | • 18g Espresso Coffee Beans |
| 3 | **Cappuccino** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 10g Sugar |
| 4 | **Cafe Latte** | • 18g Espresso Coffee Beans<br>• 200ml Full Cream Milk<br>• 10g Sugar |
| 5 | **Cafe Mocha** | • 18g Espresso Coffee Beans<br>• 180ml Full Cream Milk<br>• 20ml Chocolate Sauce |
| 6 | **Hazelnut Cappuccino** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 15ml Hazelnut Syrup |
| 7 | **Caramel Macchiato** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 15ml Caramel Syrup |
| 8 | **Cortado** | • 18g Espresso Coffee Beans<br>• 100ml Full Cream Milk |
| 9 | **Flat White** | • 36g Espresso Coffee Beans<br>• 150ml Full Cream Milk |
| 10 | **Irish Coffee** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 15ml Vanilla Syrup |

## ❄️ 2. Cold Coffee

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 11 | **Classic Cold Coffee** | • 20g Espresso Coffee Beans<br>• 200ml Full Cream Milk<br>• 50ml Vanilla Ice Cream<br>• 20g Sugar |
| 12 | **Iced Americano** | • 18g Espresso Coffee Beans<br>• 10g Sugar |
| 13 | **Iced Latte** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 10g Sugar |
| 14 | **Chocolate Frappe** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 30ml Chocolate Sauce |
| 15 | **Hazelnut Frappe** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 20ml Hazelnut Syrup |
| 16 | **Oreo Cookie Frappe** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 20ml Chocolate Sauce |
| 17 | **Brownie Blast Frappe** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 30ml Chocolate Sauce |
| 18 | **Caramel Frappe** | • 18g Espresso Coffee Beans<br>• 150ml Full Cream Milk<br>• 20ml Caramel Syrup |
| 19 | **Nitro Cold Brew** | • 30g Espresso Coffee Beans |
| 20 | **Coffee Float** | • 18g Espresso Coffee Beans<br>• 100ml Full Cream Milk<br>• 60ml Vanilla Ice Cream |

## 🍵 3. Chai & Tea

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 21 | **Masala Chai** | • 5g Black Tea Leaves<br>• 100ml Full Cream Milk<br>• 10g Sugar<br>• 2g Chai Masala Premix |
| 22 | **Adrak Chai** | • 5g Black Tea Leaves<br>• 100ml Full Cream Milk<br>• 10g Sugar |
| 23 | **Elaichi Chai** | • 5g Black Tea Leaves<br>• 100ml Full Cream Milk<br>• 10g Sugar |
| 24 | **Kesar Chai** | • 5g Black Tea Leaves<br>• 100ml Full Cream Milk<br>• 10g Sugar |
| 25 | **Classic Green Tea** | • 1 Green Tea Bag |
| 26 | **Lemon Honey Tea** | • 5g Black Tea Leaves<br>• 20g Sugar |
| 27 | **Chamomile Tea** | • 1 Green Tea Bag (substitute) |
| 28 | **Earl Grey Tea** | • 1 Green Tea Bag (substitute)<br>• 10ml Full Cream Milk |
| 29 | **Kashmiri Kahwa** | • 5g Black Tea Leaves<br>• 10g Sugar |
| 30 | **Belgian Hot Chocolate** | • 30g Cocoa Powder<br>• 200ml Full Cream Milk<br>• 20g Sugar |

## 🥤 4. Shakes & Smoothies

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 31 | **Classic Vanilla Shake** | • 200ml Full Cream Milk<br>• 100ml Vanilla Ice Cream<br>• 20ml Vanilla Syrup |
| 32 | **Double Chocolate Shake** | • 200ml Full Cream Milk<br>• 100ml Vanilla Ice Cream<br>• 30ml Chocolate Sauce |
| 33 | **Strawberry Shake** | • 200ml Full Cream Milk<br>• 100ml Vanilla Ice Cream<br>• 30ml Strawberry Crush |
| 34 | **KitKat Shake** | • 200ml Full Cream Milk<br>• 100ml Vanilla Ice Cream<br>• 20ml Chocolate Sauce |
| 35 | **Oreo Shake** | • 200ml Full Cream Milk<br>• 100ml Vanilla Ice Cream<br>• 10ml Vanilla Syrup |
| 36 | **Mango Lassi / Smoothie** | • 150ml Full Cream Milk<br>• 20g Sugar |
| 37 | **Berry Blast Smoothie** | • 150ml Full Cream Milk<br>• 50ml Vanilla Ice Cream<br>• 40ml Strawberry Crush |
| 38 | **Ferrero Rocher Shake** | • 200ml Full Cream Milk<br>• 100ml Vanilla Ice Cream<br>• 40ml Chocolate Sauce |
| 39 | **Peanut Butter Banana Shake** | • 200ml Full Cream Milk<br>• 50ml Vanilla Ice Cream<br>• 10g Sugar |
| 40 | **Chilled Bournvita Shake** | • 250ml Full Cream Milk<br>• 20g Cocoa Powder<br>• 10g Sugar |

## 🍹 5. Coolers & Mojitos

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 41 | **Virgin Mojito** | • 30ml Mint Mojito Syrup<br>• 20g Sugar |
| 42 | **Blue Lagoon** | • 30ml Mint Mojito Syrup<br>• 10g Sugar |
| 43 | **Fresh Watermelon Cooler** | • 30ml Strawberry Crush<br>• 10g Sugar |
| 44 | **Spicy Guava** | • 30ml Strawberry Crush<br>• 2g Chilly Flakes |
| 45 | **Peach Iced Tea** | • 2g Black Tea Leaves<br>• 20ml Strawberry Crush |
| 46 | **Lemon Iced Tea** | • 2g Black Tea Leaves<br>• 20g Sugar |
| 47 | **Green Apple Soda** | • 30ml Mint Mojito Syrup |
| 48 | **Masala Lemonade (Shikanji)** | • 20g Sugar<br>• 1g Chilly Flakes |
| 49 | **Virgin Pina Colada** | • 100ml Full Cream Milk<br>• 20ml Vanilla Syrup |
| 50 | **Cucumber Mint Cooler** | • 30ml Mint Mojito Syrup |

## 🍟 6. Quick Bites

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 51 | **Classic Salted Fries** | • 200g Frozen French Fries<br>• 2g Salt |
| 52 | **Peri Peri Fries** | • 200g Frozen French Fries<br>• 5g Peri Peri Spice Mix |
| 53 | **Cheesy Fries** | • 200g Frozen French Fries<br>• 30g Eggless Mayonnaise<br>• 1 Cheese Slice |
| 54 | **Potato Wedges** | • 200g Potato Wedges |
| 55 | **Garlic Bread** | • 2 Jumbo Bread Slices<br>• 10g Amul Butter |
| 56 | **Cheese Garlic Bread** | • 2 Jumbo Bread Slices<br>• 10g Amul Butter<br>• 30g Mozzarella Cheese |
| 57 | **Veg Nuggets (8pcs)** | • 8 Frozen Nuggets (Veg)<br>• 20g Tomato Ketchup |
| 58 | **Chicken Nuggets (6pcs)** | • 6 Frozen Nuggets (Chicken)<br>• 20g Tomato Ketchup |
| 59 | **Onion Rings** | • 150g Onion |
| 60 | **Chilly Cheese Toast** | • 2 Jumbo Bread Slices<br>• 1 Cheese Slice<br>• 10g Capsicum |

## 🥪 7. Sandwiches & Toasties

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 61 | **Mumbai Masala Sandwich** | • 3 Jumbo Bread Slices<br>• 20g Amul Butter<br>• 30g Onion |
| 62 | **Veg Cole Slaw Sandwich** | • 3 Jumbo Bread Slices<br>• 30g Eggless Mayonnaise |
| 63 | **Tandoori Paneer Sandwich** | • 3 Jumbo Bread Slices<br>• 50g Paneer Block<br>• 20g Eggless Mayonnaise |
| 64 | **Corn & Spinach Sandwich** | • 3 Jumbo Bread Slices<br>• 1 Cheese Slice |
| 65 | **Chicken Mayo Sandwich** | • 3 Jumbo Bread Slices<br>• 1 Frozen Chicken Patty<br>• 30g Eggless Mayonnaise |
| 66 | **Chicken Tikka Sandwich** | • 3 Jumbo Bread Slices<br>• 1 Frozen Chicken Patty<br>• 5g Peri Peri Spice Mix |
| 67 | **Veg Club Sandwich** | • 3 Jumbo Bread Slices<br>• 2 Cheese Slices<br>• 30g Tomato |
| 68 | **Non-Veg Club Sandwich** | • 3 Jumbo Bread Slices<br>• 1 Frozen Chicken Patty<br>• 1 Cheese Slice |
| 69 | **Grilled Cheese Sandwich** | • 2 Jumbo Bread Slices<br>• 2 Cheese Slices |
| 70 | **Mushroom Cheese Toast** | • 2 Jumbo Bread Slices<br>• 30g Mozzarella Cheese |

## 🍔 8. Burgers & Wraps

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 71 | **Classic Veg Burger** | • 1 Burger Bun<br>• 1 Frozen Veg Patty<br>• 1 Lettuce leaf<br>• 20g Eggless Mayonnaise |
| 72 | **Crispy Paneer Burger** | • 1 Burger Bun<br>• 50g Paneer Block<br>• 1 Lettuce leaf |
| 73 | **Peri Peri Veg Burger** | • 1 Burger Bun<br>• 1 Frozen Veg Patty<br>• 5g Peri Peri Spice Mix |
| 74 | **Classic Chicken Burger** | • 1 Burger Bun<br>• 1 Frozen Chicken Patty<br>• 20g Eggless Mayonnaise |
| 75 | **Tandoori Chicken Burger** | • 1 Burger Bun<br>• 1 Frozen Chicken Patty<br>• 10g Onion |
| 76 | **Mighty Chicken Burger** | • 1 Burger Bun<br>• 2 Frozen Chicken Patties<br>• 1 Cheese Slice |
| 77 | **Veggie Wrap** | • 1 Tortilla Wrap<br>• 1 Frozen Veg Patty<br>• 1 Lettuce leaf |
| 78 | **Paneer Tikka Wrap** | • 1 Tortilla Wrap<br>• 50g Paneer Block<br>• 10g Onion |
| 79 | **Chicken Tikka Wrap** | • 1 Tortilla Wrap<br>• 1 Frozen Chicken Patty<br>• 20g Eggless Mayonnaise |
| 80 | **Mexican Burrito Wrap** | • 1 Tortilla Wrap<br>• 20g Tomato Ketchup<br>• 10g Onion |

## 🍝 9. Pastas & Bowls

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 81 | **Vegetable Maggi** | • 1 Maggi Noodles Cake<br>• 10g Tomato |
| 82 | **Cheese Maggi** | • 1 Maggi Noodles Cake<br>• 1 Cheese Slice |
| 83 | **Schezwan Maggi** | • 1 Maggi Noodles Cake<br>• 10g Peri Peri Spice Mix |
| 84 | **Egg Maggi** | • 1 Maggi Noodles Cake<br>• 1 Frozen Veg Patty (Egg sub) |
| 85 | **Penne Arrabbiata (Red)** | • 100g Penne Pasta (Dry)<br>• 50g Red Pasta Sauce |
| 86 | **Penne Alfredo (White)** | • 100g Penne Pasta (Dry)<br>• 40g White Sauce Premix<br>• 50ml Full Cream Milk |
| 87 | **Pink Sauce Pasta** | • 100g Penne Pasta (Dry)<br>• 30g Red Pasta Sauce<br>• 30g White Sauce Premix |
| 88 | **Spaghetti Aglio e Olio** | • 100g Spaghetti (Dry)<br>• 5g Chilly Flakes |
| 89 | **Baked Mac & Cheese** | • 100g Penne Pasta (Dry)<br>• 2 Cheese Slices |
| 90 | **Paneer Makhani Rice Bowl** | • 100g Penne Pasta (Rice sub)<br>• 50g Paneer Block |

## 🍰 10. Desserts & Bakery

| ID | Menu Item | Ingredients Deducted per Unit |
| :--- | :--- | :--- |
| 91 | **Walnut Brownie** | • 1 Jumbo Bread Slice (Brownie sub)<br>• 20g Chocolate Sauce |
| 92 | **Sizzling Brownie** | • 1 Jumbo Bread Slice (Brownie sub)<br>• 50ml Vanilla Ice Cream<br>• 20g Chocolate Sauce |
| 93 | **Blueberry Cheesecake** | • 2 Cheese Slices |
| 94 | **Choco Truffle Pastry** | • 1 Jumbo Bread Slice (Pastry sub) |
| 95 | **Red Velvet Slice** | • 1 Jumbo Bread Slice (Cake sub) |
| 96 | **Chocolate Waffle** | • 1 Croissant Dough (Waffle sub)<br>• 30ml Chocolate Sauce |
| 97 | **Nutella Strawberry Waffle** | • 1 Croissant Dough (Waffle sub)<br>• 30ml Hazelnut Syrup |
| 98 | **Choco Lava Cake** | • 30g Cocoa Powder<br>• 20g Sugar |
| 99 | **Butter Croissant** | • 1 Croissant Dough |
| 100 | **Chocochip Muffin** | • 1 Jumbo Bread Slice (Muffin sub) |
