package com.coffeeshop.config;

import com.coffeeshop.entity.*;
import com.coffeeshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

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
            User cashier = new User();
            cashier.setName("Cashier User");
            cashier.setEmail("cashier@coffeeshop.com");
            cashier.setPassword(passwordEncoder.encode("Cashier@123"));
            cashier.setActive(true);
            Set<Role> cashierRoles = new HashSet<>();
            cashierRoles.add(roleRepository.findByName(Role.RoleName.ROLE_CASHIER).get());
            cashier.setRoles(cashierRoles);
            userRepository.save(cashier);
        }

        if (userRepository.findByEmail("barista@coffeeshop.com").isEmpty()) {
            User barista = new User();
            barista.setName("Barista User");
            barista.setEmail("barista@coffeeshop.com");
            barista.setPassword(passwordEncoder.encode("Barista@123"));
            barista.setActive(true);
            Set<Role> baristaRoles = new HashSet<>();
            baristaRoles.add(roleRepository.findByName(Role.RoleName.ROLE_BARISTA).get());
            barista.setRoles(baristaRoles);
            userRepository.save(barista);
        }

        if (userRepository.findByEmail("inventory@coffeeshop.com").isEmpty()) {
            User inventoryManager = new User();
            inventoryManager.setName("Inventory Manager");
            inventoryManager.setEmail("inventory@coffeeshop.com");
            inventoryManager.setPassword(passwordEncoder.encode("Inventory@123"));
            inventoryManager.setActive(true);
            Set<Role> inventoryRoles = new HashSet<>();
            inventoryRoles.add(roleRepository.findByName(Role.RoleName.ROLE_INVENTORY_MANAGER).get());
            inventoryManager.setRoles(inventoryRoles);
            userRepository.save(inventoryManager);
        }
    }

    private void initializeInventory() {
        if (inventoryItemRepository.count() > 0) return;

        createInventoryItem("Milk", "Liters", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Espresso Beans", "kg", new BigDecimal("50.00"), new BigDecimal("5.00"));
        createInventoryItem("Sugar", "kg", new BigDecimal("20.00"), new BigDecimal("2.00"));
        createInventoryItem("Chocolate Syrup", "Liters", new BigDecimal("10.00"), new BigDecimal("1.00"));
        createInventoryItem("Whipped Cream", "kg", new BigDecimal("10.00"), new BigDecimal("1.00"));
        createInventoryItem("Croissant", "Pieces", new BigDecimal("50.00"), new BigDecimal("5.00"));
        createInventoryItem("Tea Bags", "Pieces", new BigDecimal("100.00"), new BigDecimal("10.00"));
        createInventoryItem("Caramel Syrup", "Liters", new BigDecimal("10.00"), new BigDecimal("1.00"));
        createInventoryItem("Vanilla Syrup", "Liters", new BigDecimal("10.00"), new BigDecimal("1.00"));
        createInventoryItem("Muffins", "Pieces", new BigDecimal("50.00"), new BigDecimal("5.00"));
        createInventoryItem("Bagels", "Pieces", new BigDecimal("50.00"), new BigDecimal("5.00"));
    }

    private void createInventoryItem(String name, String unit, BigDecimal stock, BigDecimal reorder) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setUnit(unit);
        item.setCurrentStock(stock);
        item.setReorderLevel(reorder);
        inventoryItemRepository.save(item);
    }

    private void initializeMenu() {
        if (menuItemRepository.count() > 0) return;

        Category coffeeCat = createCategory("Coffee", "Freshly brewed coffee");
        Category teaCat = createCategory("Tea", "Herbal and classic teas");
        Category bakeryCat = createCategory("Bakery", "Fresh baked goods");
        Category specialCat = createCategory("Specialty", "Signature drinks");

        InventoryItem milk = inventoryItemRepository.findByName("Milk").orElseThrow();
        InventoryItem beans = inventoryItemRepository.findByName("Espresso Beans").orElseThrow();
        InventoryItem sugar = inventoryItemRepository.findByName("Sugar").orElseThrow();
        InventoryItem chocoSyrup = inventoryItemRepository.findByName("Chocolate Syrup").orElseThrow();
        InventoryItem whippedCream = inventoryItemRepository.findByName("Whipped Cream").orElseThrow();
        InventoryItem croissant = inventoryItemRepository.findByName("Croissant").orElseThrow();
        InventoryItem teaBag = inventoryItemRepository.findByName("Tea Bags").orElseThrow();
        InventoryItem caramelSyrup = inventoryItemRepository.findByName("Caramel Syrup").orElseThrow();
        InventoryItem vanillaSyrup = inventoryItemRepository.findByName("Vanilla Syrup").orElseThrow();
        InventoryItem muffins = inventoryItemRepository.findByName("Muffins").orElseThrow();
        InventoryItem bagels = inventoryItemRepository.findByName("Bagels").orElseThrow();

        // 1. Latte: Milk (100ml -> 0.1L), Beans (5g -> 0.005kg), Sugar (10g -> 0.01kg)
        createMenuItem("Latte", new BigDecimal("4.50"), coffeeCat, 
            Map.of(milk, new BigDecimal("0.10"), 
                   beans, new BigDecimal("0.005"), 
                   sugar, new BigDecimal("0.01")));

        // 2. Cappuccino: Same as Latte logic
        createMenuItem("Cappuccino", new BigDecimal("4.50"), coffeeCat, 
            Map.of(milk, new BigDecimal("0.10"), 
                   beans, new BigDecimal("0.005"), 
                   sugar, new BigDecimal("0.01")));

        // 3. Espresso: Beans (5g), Sugar (10g)
        createMenuItem("Espresso", new BigDecimal("3.00"), coffeeCat, 
            Map.of(beans, new BigDecimal("0.005"), 
                   sugar, new BigDecimal("0.01")));

        // 4. Vanilla Latte: Milk (0.1), Beans (0.005), Sugar (0.01), Vanilla (20ml -> 0.02L)
        createMenuItem("Vanilla Latte", new BigDecimal("5.00"), specialCat, 
            Map.of(milk, new BigDecimal("0.10"), 
                   beans, new BigDecimal("0.005"), 
                   sugar, new BigDecimal("0.01"),
                   vanillaSyrup, new BigDecimal("0.02")));

        // 5. Caramel Macchiato: Milk (0.1), Beans (0.005), Sugar (0.01), Caramel (20ml -> 0.02L)
        createMenuItem("Caramel Macchiato", new BigDecimal("5.00"), specialCat, 
            Map.of(milk, new BigDecimal("0.10"), 
                   beans, new BigDecimal("0.005"), 
                   sugar, new BigDecimal("0.01"),
                   caramelSyrup, new BigDecimal("0.02")));

        // 6. Chocolate Mocha: Milk (0.1), Beans (0.005), Sugar (20g -> 0.02kg - Sweet), ChocoSyrup (10ml -> 0.01L), WhippedCream (50g -> 0.05kg - Creams)
        createMenuItem("Chocolate Mocha", new BigDecimal("5.50"), specialCat, 
            Map.of(milk, new BigDecimal("0.10"), 
                   beans, new BigDecimal("0.005"), 
                   sugar, new BigDecimal("0.02"),
                   chocoSyrup, new BigDecimal("0.01"),
                   whippedCream, new BigDecimal("0.05")));

        // 7. Tea: Tea Bag (1), Sugar (10g -> 0.01kg)
        createMenuItem("Green Tea", new BigDecimal("3.00"), teaCat, 
            Map.of(teaBag, new BigDecimal("1.00"), 
                   sugar, new BigDecimal("0.01")));

        // 8. Croissant: Croissant (1)
        createMenuItem("Butter Croissant", new BigDecimal("2.50"), bakeryCat, 
            Map.of(croissant, new BigDecimal("1.00")));

        // 9. Muffin: Muffin (1)
        createMenuItem("Blueberry Muffin", new BigDecimal("3.00"), bakeryCat, 
            Map.of(muffins, new BigDecimal("1.00")));

        // 10. Bagel: Bagel (1)
        createMenuItem("Plain Bagel", new BigDecimal("2.00"), bakeryCat, 
            Map.of(bagels, new BigDecimal("1.00")));
    }

    private Category createCategory(String name, String desc) {
        Category cat = new Category();
        cat.setName(name);
        cat.setDescription(desc);
        return categoryRepository.save(cat);
    }

    private void createMenuItem(String name, BigDecimal price, Category category, Map<InventoryItem, BigDecimal> ingredients) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setPrice(price);
        item.setCategory(category);
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
