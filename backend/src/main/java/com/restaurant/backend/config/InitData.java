package com.restaurant.backend.config;

import com.restaurant.backend.model.RestaurantTable;
import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.Restaurant;
import com.restaurant.backend.model.Role;
import com.restaurant.backend.model.User;
import com.restaurant.backend.repository.MenuItemRepository;
import com.restaurant.backend.repository.RestaurantRepository;
import com.restaurant.backend.repository.TableRepository;
import com.restaurant.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class InitData {

    @Bean
    public CommandLineRunner loadData(
            TableRepository tableRepository,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (restaurantRepository.count() == 0) {
                User adminOne = createAdminIfMissing(userRepository, passwordEncoder, "admin_royal", "admin.royal@restaurant.local");
                User adminTwo = createAdminIfMissing(userRepository, passwordEncoder, "admin_spice", "admin.spice@restaurant.local");

                Restaurant r1 = new Restaurant();
                r1.setName("Royal Tandoor");
                r1.setCuisine("North Indian");
                r1.setAddress("MG Road, Bengaluru");
                r1.setLogoImageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80");
                r1.setCoverImageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80");
                r1.setAdminUserId(adminOne.getId());
                r1 = restaurantRepository.save(r1);

                Restaurant r2 = new Restaurant();
                r2.setName("Spice Harbor");
                r2.setCuisine("Coastal Fusion");
                r2.setAddress("Bandra West, Mumbai");
                r2.setLogoImageUrl("https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=400&q=80");
                r2.setCoverImageUrl("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80");
                r2.setAdminUserId(adminTwo.getId());
                r2 = restaurantRepository.save(r2);

                adminOne.setRestaurantId(r1.getId());
                userRepository.save(adminOne);
                adminTwo.setRestaurantId(r2.getId());
                userRepository.save(adminTwo);

                seedTablesForRestaurant(tableRepository, r1.getId());
                seedTablesForRestaurant(tableRepository, r2.getId());

                menuItemRepository.saveAll(List.of(
                        new MenuItem(null, r1.getId(), "Butter Chicken", "Creamy tomato curry with tender chicken.", "Main Course", 329, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80", true, 0, 0),
                        new MenuItem(null, r1.getId(), "Paneer Tikka", "Char-grilled paneer with mint chutney.", "Starters", 269, "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=900&q=80", true, 0, 0),
                        new MenuItem(null, r1.getId(), "Garlic Naan", "Soft tandoori bread with garlic butter.", "Breads", 79, "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80", true, 0, 0),
                        new MenuItem(null, r2.getId(), "Prawn Ghee Roast", "Spicy Mangalorean style prawns.", "Main Course", 459, "https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80", true, 0, 0),
                        new MenuItem(null, r2.getId(), "Neer Dosa", "Soft rice crepes served with curry.", "Breads", 129, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", true, 0, 0),
                        new MenuItem(null, r2.getId(), "Tender Coconut Payasam", "Chilled coconut dessert.", "Dessert", 149, "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80", true, 0, 0)
                ));

                System.out.println("Initialized multi-restaurant demo data with separate admins.");
            }

            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@restaurant.local");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Initialized default admin user: admin / admin123");
            }
        };
    }

    private User createAdminIfMissing(UserRepository userRepository, PasswordEncoder passwordEncoder, String username, String email) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User admin = new User();
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            return userRepository.save(admin);
        });
    }

    private void seedTablesForRestaurant(TableRepository tableRepository, String restaurantId) {
        if (!tableRepository.findByRestaurantIdOrderByTableNumberAsc(restaurantId).isEmpty()) {
            return;
        }

        tableRepository.saveAll(Arrays.asList(
                new RestaurantTable(null, restaurantId, 1, 2, false),
                new RestaurantTable(null, restaurantId, 2, 2, false),
                new RestaurantTable(null, restaurantId, 3, 4, false),
                new RestaurantTable(null, restaurantId, 4, 4, false),
                new RestaurantTable(null, restaurantId, 5, 6, false),
                new RestaurantTable(null, restaurantId, 6, 8, false)
        ));
    }
}
