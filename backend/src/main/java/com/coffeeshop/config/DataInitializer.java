package com.coffeeshop.config;

import com.coffeeshop.entity.*;
import com.coffeeshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
        initializeInventory();
        initializeMenu();
    }

    private void initializeRoles() {
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }

    private void initializeUsers() {
        if (userRepository.findByEmail("admin@coffeeshop.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@coffeeshop.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setActive(true);
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(roleRepository.findByName(Role.RoleName.ROLE_ADMIN).get());
            admin.setRoles(adminRoles);
            userRepository.save(admin);
        }
        if (userRepository.findByEmail("cashier@coffeeshop.com").isEmpty()) {
            User user = new User();
            user.setName("Cashier User");
            user.setEmail("cashier@coffeeshop.com");
            user.setPassword(passwordEncoder.encode("Cashier@123"));
            user.setActive(true);
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(Role.RoleName.ROLE_CASHIER).get());
            user.setRoles(roles);
            userRepository.save(user);
        }
        if (userRepository.findByEmail("barista@coffeeshop.com").isEmpty()) {
            User user = new User();
            user.setName("Barista User");
            user.setEmail("barista@coffeeshop.com");
            user.setPassword(passwordEncoder.encode("Barista@123"));
            user.setActive(true);
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(Role.RoleName.ROLE_BARISTA).get());
            user.setRoles(roles);
            userRepository.save(user);
        }
        if (userRepository.findByEmail("inventory@coffeeshop.com").isEmpty()) {
            User user = new User();
            user.setName("Inventory Manager");
            user.setEmail("inventory@coffeeshop.com");
            user.setPassword(passwordEncoder.encode("Inventory@123"));
            user.setActive(true);
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(Role.RoleName.ROLE_INVENTORY_MANAGER).get());
            user.setRoles(roles);
            userRepository.save(user);
        }
    }

    private void initializeInventory() {
        if (inventoryItemRepository.count() > 0) return;

        // Base
        createInventoryItem("Milk", "Liters", new BigDecimal("200.00"), new BigDecimal("20.00"));
        createInventoryItem("Espresso Beans", "kg", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Sugar", "kg", new BigDecimal("50.00"), new BigDecimal("5.00"));
        createInventoryItem("Ice", "kg", new BigDecimal("100.00"), new BigDecimal("10.00"));

        // Add-ons
        createInventoryItem("Chocolate Syrup", "Liters", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Caramel Syrup", "Liters", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Vanilla Syrup", "Liters", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Hazelnut Syrup", "Liters", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Whipped Cream", "kg", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Cocoa Powder", "kg", new BigDecimal("10.00"), new BigDecimal("1.00"));

        // Bakery
        createInventoryItem("Croissant", "Pieces", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Bagels", "Pieces", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Muffins", "Pieces", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Cookies", "Pieces", new BigDecimal("200.00"), new BigDecimal("20.00"));
        createInventoryItem("Bread", "Pieces", new BigDecimal("200.00"), new BigDecimal("20.00"));

        // Fresh
        createInventoryItem("Eggs", "Pieces", new BigDecimal("200.00"), new BigDecimal("20.00"));
        createInventoryItem("Ham", "kg", new BigDecimal("30.00"), new BigDecimal("3.00"));
        createInventoryItem("Cheese", "kg", new BigDecimal("30.00"), new BigDecimal("3.00"));
        createInventoryItem("Mixed Berries", "kg", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Mango", "kg", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Bananas", "kg", new BigDecimal("30.00"), new BigDecimal("3.00"));
        createInventoryItem("Oranges", "kg", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Tea Bags", "Pieces", new BigDecimal("500.00"), new BigDecimal("50.00"));
        createInventoryItem("Matcha Powder", "kg", new BigDecimal("10.00"), new BigDecimal("1.00"));
    }

    private void createInventoryItem(String name, String unit, BigDecimal stock, BigDecimal reorder) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setUnit(unit);
        item.setCurrentStock(stock);
        item.setReorderLevel(reorder);
        inventoryItemRepository.save(item);
    }

    private InventoryItem getInv(String name) {
        return inventoryItemRepository.findByName(name).orElseThrow(() -> new RuntimeException("Inventory item not found: " + name));
    }

    private void initializeMenu() {
        if (menuItemRepository.count() > 0) return;

        Category hotCoffee = createCategory("Hot Coffee", "Classic brewed coffee");
        Category coldCoffee = createCategory("Cold Coffee", "Chilled coffee drinks");
        Category teas = createCategory("Teas", "Herbal and classic teas");
        Category smoothies = createCategory("Smoothies & Juice", "Fresh fruit blends");
        Category bakery = createCategory("Bakery", "Fresh pastries");
        Category food = createCategory("Breakfast & Food", "Savory meals");

        InventoryItem beans = getInv("Espresso Beans");
        InventoryItem milk = getInv("Milk");
        InventoryItem sugar = getInv("Sugar");
        InventoryItem ice = getInv("Ice");
        InventoryItem choco = getInv("Chocolate Syrup");
        InventoryItem caramel = getInv("Caramel Syrup");
        InventoryItem vanilla = getInv("Vanilla Syrup");
        InventoryItem hazelnut = getInv("Hazelnut Syrup");
        InventoryItem cream = getInv("Whipped Cream");
        // InventoryItem cocoa = getInv("Cocoa Powder");
        InventoryItem tea = getInv("Tea Bags");
        InventoryItem matcha = getInv("Matcha Powder");
        InventoryItem berries = getInv("Mixed Berries");
        InventoryItem mango = getInv("Mango");
        InventoryItem banana = getInv("Bananas");
        InventoryItem orange = getInv("Oranges");
        InventoryItem croissant = getInv("Croissant");
        InventoryItem bagel = getInv("Bagels");
        InventoryItem muffin = getInv("Muffins");
        InventoryItem cookie = getInv("Cookies");
        InventoryItem bread = getInv("Bread");
        InventoryItem egg = getInv("Eggs");
        InventoryItem ham = getInv("Ham");
        InventoryItem cheese = getInv("Cheese");

        // --- HOT COFFEE (10 Items) ---
        createMenuItem("Espresso", new BigDecimal("3.00"), hotCoffee, "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400", Map.of(beans, new BigDecimal("0.02")));
        createMenuItem("Americano", new BigDecimal("3.50"), hotCoffee, "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400", Map.of(beans, new BigDecimal("0.02")));
        createMenuItem("Latte", new BigDecimal("4.50"), hotCoffee, "https://images.unsplash.com/photo-1570968992193-793548f5e557?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2")));
        createMenuItem("Cappuccino", new BigDecimal("4.50"), hotCoffee, "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.15")));
        createMenuItem("Flat White", new BigDecimal("4.50"), hotCoffee, "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400", Map.of(beans, new BigDecimal("0.03"), milk, new BigDecimal("0.15")));
        createMenuItem("Macchiato", new BigDecimal("3.75"), hotCoffee, "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.05")));
        createMenuItem("Mocha", new BigDecimal("5.00"), hotCoffee, "https://images.unsplash.com/photo-1578374173713-32f6ae6f3971?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2"), choco, new BigDecimal("0.03")));
        createMenuItem("White Mocha", new BigDecimal("5.25"), hotCoffee, "https://images.unsplash.com/photo-1517701604599-bb29b5c73512?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2"), choco, new BigDecimal("0.03")));
        createMenuItem("Hazelnut Latte", new BigDecimal("5.00"), hotCoffee, "https://images.unsplash.com/photo-1627993079636-c0c2e39df1ac?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2"), hazelnut, new BigDecimal("0.03")));
        createMenuItem("Vanilla Latte", new BigDecimal("5.00"), hotCoffee, "https://images.unsplash.com/photo-1570968992193-793548f5e557?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2"), vanilla, new BigDecimal("0.03")));

        // --- COLD COFFEE (8 Items) ---
        createMenuItem("Iced Coffee", new BigDecimal("4.00"), coldCoffee, "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400", Map.of(beans, new BigDecimal("0.03"), ice, new BigDecimal("0.2")));
        createMenuItem("Iced Latte", new BigDecimal("4.75"), coldCoffee, "https://images.unsplash.com/photo-1461023058943-07fbe153f4f5?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2"), ice, new BigDecimal("0.1")));
        createMenuItem("Cold Brew", new BigDecimal("4.50"), coldCoffee, "https://images.unsplash.com/photo-1461023058943-07fbe153f4f5?w=400", Map.of(beans, new BigDecimal("0.04"), ice, new BigDecimal("0.1")));
        createMenuItem("Iced Mocha", new BigDecimal("5.25"), coldCoffee, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.2"), choco, new BigDecimal("0.03"), ice, new BigDecimal("0.1")));
        createMenuItem("Frappe", new BigDecimal("5.50"), coldCoffee, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.15"), ice, new BigDecimal("0.2"), cream, new BigDecimal("0.02")));
        createMenuItem("Caramel Frappe", new BigDecimal("5.75"), coldCoffee, "https://images.unsplash.com/photo-1627993079983-49035252817d?w=400", Map.of(beans, new BigDecimal("0.02"), milk, new BigDecimal("0.15"), caramel, new BigDecimal("0.04"), ice, new BigDecimal("0.2")));
        createMenuItem("Iced Americano", new BigDecimal("3.75"), coldCoffee, "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400", Map.of(beans, new BigDecimal("0.02"), ice, new BigDecimal("0.15")));
        createMenuItem("Nitro Cold Brew", new BigDecimal("5.00"), coldCoffee, "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400", Map.of(beans, new BigDecimal("0.04")));

        // --- TEAS (8 Items) ---
        createMenuItem("Green Tea", new BigDecimal("3.00"), teas, "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400", Map.of(tea, new BigDecimal("1.0")));
        createMenuItem("Black Tea", new BigDecimal("3.00"), teas, "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400", Map.of(tea, new BigDecimal("1.0")));
        createMenuItem("Earl Grey", new BigDecimal("3.25"), teas, "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400", Map.of(tea, new BigDecimal("1.0")));
        createMenuItem("Chai Latte", new BigDecimal("4.50"), teas, "https://images.unsplash.com/photo-1596522354195-e845c85178a9?w=400", Map.of(tea, new BigDecimal("1.0"), milk, new BigDecimal("0.2")));
        createMenuItem("Matcha Latte", new BigDecimal("5.00"), teas, "https://images.unsplash.com/photo-1515823152108-3200ed436e47?w=400", Map.of(matcha, new BigDecimal("0.01"), milk, new BigDecimal("0.2")));
        createMenuItem("Iced Tea", new BigDecimal("3.50"), teas, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", Map.of(tea, new BigDecimal("1.0"), ice, new BigDecimal("0.15")));
        createMenuItem("Lemon Tea", new BigDecimal("3.75"), teas, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", Map.of(tea, new BigDecimal("1.0")));
        createMenuItem("Iced Matcha", new BigDecimal("5.25"), teas, "https://images.unsplash.com/photo-1595166669919-623253b22340?w=400", Map.of(matcha, new BigDecimal("0.01"), milk, new BigDecimal("0.15"), ice, new BigDecimal("0.1")));

        // --- SMOOTHIES & JUICE (6 Items) ---
        createMenuItem("Berry Smoothie", new BigDecimal("6.00"), smoothies, "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400", Map.of(berries, new BigDecimal("0.15"), ice, new BigDecimal("0.1")));
        createMenuItem("Mango Smoothie", new BigDecimal("6.00"), smoothies, "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400", Map.of(mango, new BigDecimal("0.15"), ice, new BigDecimal("0.1")));
        createMenuItem("Banana Smoothie", new BigDecimal("5.50"), smoothies, "https://images.unsplash.com/photo-1553530666-ba11a9068855?w=400", Map.of(banana, new BigDecimal("0.2"), milk, new BigDecimal("0.1")));
        createMenuItem("Orange Juice", new BigDecimal("4.50"), smoothies, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400", Map.of(orange, new BigDecimal("0.3")));
        createMenuItem("Mixed Fruit Juice", new BigDecimal("5.00"), smoothies, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400", Map.of(orange, new BigDecimal("0.15"), mango, new BigDecimal("0.1")));
        createMenuItem("Lemonade", new BigDecimal("4.00"), smoothies, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400", Map.of(sugar, new BigDecimal("0.05"), ice, new BigDecimal("0.15")));

        // --- BAKERY (8 Items) ---
        createMenuItem("Butter Croissant", new BigDecimal("3.00"), bakery, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", Map.of(croissant, new BigDecimal("1.0")));
        createMenuItem("Chocolate Croissant", new BigDecimal("3.75"), bakery, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", Map.of(croissant, new BigDecimal("1.0"), choco, new BigDecimal("0.01")));
        createMenuItem("Blueberry Muffin", new BigDecimal("3.50"), bakery, "https://images.unsplash.com/photo-1563249051-72f65a11dfb9?w=400", Map.of(muffin, new BigDecimal("1.0")));
        createMenuItem("Chocolate Muffin", new BigDecimal("3.50"), bakery, "https://images.unsplash.com/photo-1563249051-72f65a11dfb9?w=400", Map.of(muffin, new BigDecimal("1.0")));
        createMenuItem("Choco Chip Cookie", new BigDecimal("2.50"), bakery, "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", Map.of(cookie, new BigDecimal("1.0")));
        createMenuItem("Oatmeal Cookie", new BigDecimal("2.50"), bakery, "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", Map.of(cookie, new BigDecimal("1.0")));
        createMenuItem("Plain Bagel", new BigDecimal("2.50"), bakery, "https://images.unsplash.com/photo-1582121763177-33ddb2670355?w=400", Map.of(bagel, new BigDecimal("1.0")));
        createMenuItem("Scone", new BigDecimal("3.00"), bakery, "https://images.unsplash.com/photo-1582121763177-33ddb2670355?w=400", Map.of(bread, new BigDecimal("1.0")));

        // --- BREAKFAST & FOOD (10 Items) ---
        createMenuItem("Bagel & Cream Cheese", new BigDecimal("4.00"), food, "https://images.unsplash.com/photo-1582121763177-33ddb2670355?w=400", Map.of(bagel, new BigDecimal("1.0"), cheese, new BigDecimal("0.05")));
        createMenuItem("Egg Sandwich", new BigDecimal("6.00"), food, "https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400", Map.of(bread, new BigDecimal("2.0"), egg, new BigDecimal("1.0"), cheese, new BigDecimal("0.02")));
        createMenuItem("Ham & Cheese Sandwich", new BigDecimal("7.00"), food, "https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400", Map.of(bread, new BigDecimal("2.0"), ham, new BigDecimal("0.05"), cheese, new BigDecimal("0.02")));
        createMenuItem("Grilled Cheese", new BigDecimal("5.50"), food, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400", Map.of(bread, new BigDecimal("2.0"), cheese, new BigDecimal("0.05")));
        createMenuItem("Avocado Toast", new BigDecimal("8.00"), food, "https://images.unsplash.com/photo-1588137372308-15f09a04373c?w=400", Map.of(bread, new BigDecimal("1.0")));
        createMenuItem("Ham & Cheese Croissant", new BigDecimal("6.50"), food, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", Map.of(croissant, new BigDecimal("1.0"), ham, new BigDecimal("0.03"), cheese, new BigDecimal("0.02")));
        createMenuItem("Breakfast Burrito", new BigDecimal("7.50"), food, "https://images.unsplash.com/photo-1570461225516-40742d81dc53?w=400", Map.of(egg, new BigDecimal("2.0"), cheese, new BigDecimal("0.02")));
        createMenuItem("Oatmeal Bowl", new BigDecimal("5.00"), food, "https://images.unsplash.com/photo-1517618903820-74898236d67b?w=400", Map.of(milk, new BigDecimal("0.2")));
        createMenuItem("Yogurt Parfait", new BigDecimal("5.50"), food, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", Map.of(berries, new BigDecimal("0.1")));
        createMenuItem("Fruit Cup", new BigDecimal("4.50"), food, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400", Map.of(mango, new BigDecimal("0.1"), berries, new BigDecimal("0.1")));
    }

    private Category createCategory(String name, String desc) {
        Category cat = new Category();
        cat.setName(name);
        cat.setDescription(desc);
        return categoryRepository.save(cat);
    }

    private void createMenuItem(String name, BigDecimal price, Category category, String imageUrl, Map<InventoryItem, BigDecimal> ingredients) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setPrice(price);
        item.setCategory(category);
        item.setImageUrl(imageUrl);
        item.setActive(true);
        
        List<MenuIngredient> menuIngredients = new ArrayList<>();
        for (Map.Entry<InventoryItem, BigDecimal> entry : ingredients.entrySet()) {
            MenuIngredient mi = new MenuIngredient();
            mi.setMenuItem(item);
            mi.setInventoryItem(entry.getKey());
            mi.setQuantityRequired(entry.getValue());
            menuIngredients.add(mi);
        }
        item.setIngredients(menuIngredients);
        
        menuItemRepository.save(item);
    }
}
