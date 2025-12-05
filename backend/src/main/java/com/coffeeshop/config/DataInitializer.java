package com.coffeeshop.config;

import com.coffeeshop.entity.Role;
import com.coffeeshop.entity.User;
import com.coffeeshop.repository.RoleRepository;
import com.coffeeshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initializeRoles();
        
        // Initialize default users if they don't exist
        initializeUsers();
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
        // Admin user
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

        // Cashier user
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

        // Barista user
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

        // Inventory Manager user
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
}
