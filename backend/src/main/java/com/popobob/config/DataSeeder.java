package com.popobob.config;

import com.popobob.model.Category;
import com.popobob.model.Product;
import com.popobob.model.User;
import com.popobob.repository.CategoryRepository;
import com.popobob.repository.ProductRepository;
import com.popobob.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAdminUser();

        if (categoryRepository.count() > 0) {
            return;
        }

        Category cat_1 = new Category();
        cat_1.setId("c1");
        cat_1.setName("Milk Teas - Classics");
        cat_1.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        categoryRepository.save(cat_1);

        Product prod_1 = new Product();
        prod_1.setId("p1");
        prod_1.setName("Authentic Milk Tea");
        prod_1.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        prod_1.setPrice(new BigDecimal("249"));
        prod_1.setIsAvailable(true);
        prod_1.setCategory(cat_1);
        productRepository.save(prod_1);

        Product prod_2 = new Product();
        prod_2.setId("p2");
        prod_2.setName("Hong Kong Milk Tea");
        prod_2.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        prod_2.setPrice(new BigDecimal("249"));
        prod_2.setIsAvailable(true);
        prod_2.setCategory(cat_1);
        productRepository.save(prod_2);

        Product prod_3 = new Product();
        prod_3.setId("p3");
        prod_3.setName("Matcha Green Tea");
        prod_3.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        prod_3.setPrice(new BigDecimal("249"));
        prod_3.setIsAvailable(true);
        prod_3.setCategory(cat_1);
        productRepository.save(prod_3);

        Product prod_4 = new Product();
        prod_4.setId("p4");
        prod_4.setName("Oolong Milk Tea");
        prod_4.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        prod_4.setPrice(new BigDecimal("249"));
        prod_4.setIsAvailable(true);
        prod_4.setCategory(cat_1);
        productRepository.save(prod_4);

        Product prod_5 = new Product();
        prod_5.setId("p5");
        prod_5.setName("Taro Milk Tea");
        prod_5.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        prod_5.setPrice(new BigDecimal("249"));
        prod_5.setIsAvailable(true);
        prod_5.setCategory(cat_1);
        productRepository.save(prod_5);

        Product prod_6 = new Product();
        prod_6.setId("p6");
        prod_6.setName("Thai Milk Tea");
        prod_6.setDescription("Premium loose-leaf teas perfectly brewed and blended with rich milk.");
        prod_6.setPrice(new BigDecimal("249"));
        prod_6.setIsAvailable(true);
        prod_6.setCategory(cat_1);
        productRepository.save(prod_6);

        Category cat_2 = new Category();
        cat_2.setId("c2");
        cat_2.setName("Milk Teas - Flavoured");
        cat_2.setDescription("Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas.");
        categoryRepository.save(cat_2);

        Product prod_7 = new Product();
        prod_7.setId("p7");
        prod_7.setName("Chocolate Milk Tea");
        prod_7.setDescription("Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas.");
        prod_7.setPrice(new BigDecimal("269"));
        prod_7.setIsAvailable(true);
        prod_7.setCategory(cat_2);
        productRepository.save(prod_7);

        Product prod_8 = new Product();
        prod_8.setId("p8");
        prod_8.setName("Strawberry Milk Tea");
        prod_8.setDescription("Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas.");
        prod_8.setPrice(new BigDecimal("269"));
        prod_8.setIsAvailable(true);
        prod_8.setCategory(cat_2);
        productRepository.save(prod_8);

        Product prod_9 = new Product();
        prod_9.setId("p9");
        prod_9.setName("Mango Milk Tea");
        prod_9.setDescription("Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas.");
        prod_9.setPrice(new BigDecimal("269"));
        prod_9.setIsAvailable(true);
        prod_9.setCategory(cat_2);
        productRepository.save(prod_9);

        Product prod_10 = new Product();
        prod_10.setId("p10");
        prod_10.setName("Rose Milk Tea");
        prod_10.setDescription("Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas.");
        prod_10.setPrice(new BigDecimal("269"));
        prod_10.setIsAvailable(true);
        prod_10.setCategory(cat_2);
        productRepository.save(prod_10);

        Product prod_11 = new Product();
        prod_11.setId("p11");
        prod_11.setName("Honeydew Milk Tea");
        prod_11.setDescription("Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas.");
        prod_11.setPrice(new BigDecimal("269"));
        prod_11.setIsAvailable(true);
        prod_11.setCategory(cat_2);
        productRepository.save(prod_11);

        Category cat_3 = new Category();
        cat_3.setId("c3");
        cat_3.setName("Fruit Teas - Classics");
        cat_3.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        categoryRepository.save(cat_3);

        Product prod_12 = new Product();
        prod_12.setId("p12");
        prod_12.setName("Peach Fruit Tea");
        prod_12.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        prod_12.setPrice(new BigDecimal("219"));
        prod_12.setIsAvailable(true);
        prod_12.setCategory(cat_3);
        productRepository.save(prod_12);

        Product prod_13 = new Product();
        prod_13.setId("p13");
        prod_13.setName("Passion Fruit Tea");
        prod_13.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        prod_13.setPrice(new BigDecimal("219"));
        prod_13.setIsAvailable(true);
        prod_13.setCategory(cat_3);
        productRepository.save(prod_13);

        Product prod_14 = new Product();
        prod_14.setId("p14");
        prod_14.setName("Lychee Fruit Tea");
        prod_14.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        prod_14.setPrice(new BigDecimal("219"));
        prod_14.setIsAvailable(true);
        prod_14.setCategory(cat_3);
        productRepository.save(prod_14);

        Product prod_15 = new Product();
        prod_15.setId("p15");
        prod_15.setName("Mango Fruit Tea");
        prod_15.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        prod_15.setPrice(new BigDecimal("219"));
        prod_15.setIsAvailable(true);
        prod_15.setCategory(cat_3);
        productRepository.save(prod_15);

        Product prod_16 = new Product();
        prod_16.setId("p16");
        prod_16.setName("Green Apple Fruit Tea");
        prod_16.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        prod_16.setPrice(new BigDecimal("219"));
        prod_16.setIsAvailable(true);
        prod_16.setCategory(cat_3);
        productRepository.save(prod_16);

        Product prod_17 = new Product();
        prod_17.setId("p17");
        prod_17.setName("Strawberry Fruit Tea");
        prod_17.setDescription("Light, refreshing green teas infused with real fruit nectars.");
        prod_17.setPrice(new BigDecimal("219"));
        prod_17.setIsAvailable(true);
        prod_17.setCategory(cat_3);
        productRepository.save(prod_17);

        Category cat_4 = new Category();
        cat_4.setId("c4");
        cat_4.setName("Fruit Teas - Premium");
        cat_4.setDescription("Artisanal fruit tea blends with complex flavor profiles and premium ingredients.");
        categoryRepository.save(cat_4);

        Product prod_18 = new Product();
        prod_18.setId("p18");
        prod_18.setName("Dragonfruit Lychee");
        prod_18.setDescription("Artisanal fruit tea blends with complex flavor profiles and premium ingredients.");
        prod_18.setPrice(new BigDecimal("249"));
        prod_18.setIsAvailable(true);
        prod_18.setCategory(cat_4);
        productRepository.save(prod_18);

        Product prod_19 = new Product();
        prod_19.setId("p19");
        prod_19.setName("Grapefruit Yakult");
        prod_19.setDescription("Artisanal fruit tea blends with complex flavor profiles and premium ingredients.");
        prod_19.setPrice(new BigDecimal("249"));
        prod_19.setIsAvailable(true);
        prod_19.setCategory(cat_4);
        productRepository.save(prod_19);

        Product prod_20 = new Product();
        prod_20.setId("p20");
        prod_20.setName("Mango Pomelo Sago");
        prod_20.setDescription("Artisanal fruit tea blends with complex flavor profiles and premium ingredients.");
        prod_20.setPrice(new BigDecimal("249"));
        prod_20.setIsAvailable(true);
        prod_20.setCategory(cat_4);
        productRepository.save(prod_20);

        Product prod_21 = new Product();
        prod_21.setId("p21");
        prod_21.setName("Mixed Berry Blast");
        prod_21.setDescription("Artisanal fruit tea blends with complex flavor profiles and premium ingredients.");
        prod_21.setPrice(new BigDecimal("249"));
        prod_21.setIsAvailable(true);
        prod_21.setCategory(cat_4);
        productRepository.save(prod_21);

        Product prod_22 = new Product();
        prod_22.setId("p22");
        prod_22.setName("Tropical Paradise");
        prod_22.setDescription("Artisanal fruit tea blends with complex flavor profiles and premium ingredients.");
        prod_22.setPrice(new BigDecimal("249"));
        prod_22.setIsAvailable(true);
        prod_22.setCategory(cat_4);
        productRepository.save(prod_22);

        Category cat_5 = new Category();
        cat_5.setId("c5");
        cat_5.setName("Boba Shakes - All Time Boba Milkshakes");
        cat_5.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        categoryRepository.save(cat_5);

        Product prod_23 = new Product();
        prod_23.setId("p23");
        prod_23.setName("Vanilla Milkshake");
        prod_23.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        prod_23.setPrice(new BigDecimal("279"));
        prod_23.setIsAvailable(true);
        prod_23.setCategory(cat_5);
        productRepository.save(prod_23);

        Product prod_24 = new Product();
        prod_24.setId("p24");
        prod_24.setName("Chocolate Milkshake");
        prod_24.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        prod_24.setPrice(new BigDecimal("279"));
        prod_24.setIsAvailable(true);
        prod_24.setCategory(cat_5);
        productRepository.save(prod_24);

        Product prod_25 = new Product();
        prod_25.setId("p25");
        prod_25.setName("Strawberry Milkshake");
        prod_25.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        prod_25.setPrice(new BigDecimal("279"));
        prod_25.setIsAvailable(true);
        prod_25.setCategory(cat_5);
        productRepository.save(prod_25);

        Product prod_26 = new Product();
        prod_26.setId("p26");
        prod_26.setName("Blueberry Milkshake");
        prod_26.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        prod_26.setPrice(new BigDecimal("279"));
        prod_26.setIsAvailable(true);
        prod_26.setCategory(cat_5);
        productRepository.save(prod_26);

        Product prod_27 = new Product();
        prod_27.setId("p27");
        prod_27.setName("Lychee Milkshake");
        prod_27.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        prod_27.setPrice(new BigDecimal("279"));
        prod_27.setIsAvailable(true);
        prod_27.setCategory(cat_5);
        productRepository.save(prod_27);

        Product prod_28 = new Product();
        prod_28.setId("p28");
        prod_28.setName("Mango Milkshake");
        prod_28.setDescription("Thick, creamy, and decadent milkshakes blended with chewy boba.");
        prod_28.setPrice(new BigDecimal("279"));
        prod_28.setIsAvailable(true);
        prod_28.setCategory(cat_5);
        productRepository.save(prod_28);

        Category cat_6 = new Category();
        cat_6.setId("c6");
        cat_6.setName("Boba Shakes - Signature Boba Milk Shakes");
        cat_6.setDescription("Over-the-top signature shakes with premium toppings and drizzles.");
        categoryRepository.save(cat_6);

        Product prod_29 = new Product();
        prod_29.setId("p29");
        prod_29.setName("Ferrero Rocher Milkshake");
        prod_29.setDescription("Over-the-top signature shakes with premium toppings and drizzles.");
        prod_29.setPrice(new BigDecimal("319"));
        prod_29.setIsAvailable(true);
        prod_29.setCategory(cat_6);
        productRepository.save(prod_29);

        Product prod_30 = new Product();
        prod_30.setId("p30");
        prod_30.setName("Caramel Popcorn Milkshake");
        prod_30.setDescription("Over-the-top signature shakes with premium toppings and drizzles.");
        prod_30.setPrice(new BigDecimal("319"));
        prod_30.setIsAvailable(true);
        prod_30.setCategory(cat_6);
        productRepository.save(prod_30);

        Product prod_31 = new Product();
        prod_31.setId("p31");
        prod_31.setName("Oreo Milkshake");
        prod_31.setDescription("Over-the-top signature shakes with premium toppings and drizzles.");
        prod_31.setPrice(new BigDecimal("319"));
        prod_31.setIsAvailable(true);
        prod_31.setCategory(cat_6);
        productRepository.save(prod_31);

        Product prod_32 = new Product();
        prod_32.setId("p32");
        prod_32.setName("Sea Salt Biscoff Milkshake");
        prod_32.setDescription("Over-the-top signature shakes with premium toppings and drizzles.");
        prod_32.setPrice(new BigDecimal("319"));
        prod_32.setIsAvailable(true);
        prod_32.setCategory(cat_6);
        productRepository.save(prod_32);

        Category cat_7 = new Category();
        cat_7.setId("c7");
        cat_7.setName("Cold Coffee");
        cat_7.setDescription("Ice-blended coffee creations perfect for a hot day.");
        categoryRepository.save(cat_7);

        Product prod_33 = new Product();
        prod_33.setId("p33");
        prod_33.setName("Cafe Frappe");
        prod_33.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_33.setPrice(new BigDecimal("249"));
        prod_33.setIsAvailable(true);
        prod_33.setCategory(cat_7);
        productRepository.save(prod_33);

        Product prod_34 = new Product();
        prod_34.setId("p34");
        prod_34.setName("Almond Frappe");
        prod_34.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_34.setPrice(new BigDecimal("249"));
        prod_34.setIsAvailable(true);
        prod_34.setCategory(cat_7);
        productRepository.save(prod_34);

        Product prod_35 = new Product();
        prod_35.setId("p35");
        prod_35.setName("Caramel Frappe");
        prod_35.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_35.setPrice(new BigDecimal("249"));
        prod_35.setIsAvailable(true);
        prod_35.setCategory(cat_7);
        productRepository.save(prod_35);

        Product prod_36 = new Product();
        prod_36.setId("p36");
        prod_36.setName("Mocha Frappe");
        prod_36.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_36.setPrice(new BigDecimal("249"));
        prod_36.setIsAvailable(true);
        prod_36.setCategory(cat_7);
        productRepository.save(prod_36);

        Product prod_37 = new Product();
        prod_37.setId("p37");
        prod_37.setName("Cookie And Cream Frappe");
        prod_37.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_37.setPrice(new BigDecimal("249"));
        prod_37.setIsAvailable(true);
        prod_37.setCategory(cat_7);
        productRepository.save(prod_37);

        Product prod_38 = new Product();
        prod_38.setId("p38");
        prod_38.setName("Hazelnut Frappe");
        prod_38.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_38.setPrice(new BigDecimal("249"));
        prod_38.setIsAvailable(true);
        prod_38.setCategory(cat_7);
        productRepository.save(prod_38);

        Product prod_39 = new Product();
        prod_39.setId("p39");
        prod_39.setName("Ferrero Rocher Frappe");
        prod_39.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_39.setPrice(new BigDecimal("249"));
        prod_39.setIsAvailable(true);
        prod_39.setCategory(cat_7);
        productRepository.save(prod_39);

        Product prod_40 = new Product();
        prod_40.setId("p40");
        prod_40.setName("Biscoff Frappe");
        prod_40.setDescription("Ice-blended coffee creations perfect for a hot day.");
        prod_40.setPrice(new BigDecimal("249"));
        prod_40.setIsAvailable(true);
        prod_40.setCategory(cat_7);
        productRepository.save(prod_40);

        Category cat_8 = new Category();
        cat_8.setId("c8");
        cat_8.setName("Chillers - Lemonade");
        cat_8.setDescription("Zesty, thirst-quenching lemonades with a sparkling twist.");
        categoryRepository.save(cat_8);

        Product prod_41 = new Product();
        prod_41.setId("p41");
        prod_41.setName("Classic Lemonade");
        prod_41.setDescription("Zesty, thirst-quenching lemonades with a sparkling twist.");
        prod_41.setPrice(new BigDecimal("189"));
        prod_41.setIsAvailable(true);
        prod_41.setCategory(cat_8);
        productRepository.save(prod_41);

        Product prod_42 = new Product();
        prod_42.setId("p42");
        prod_42.setName("Sweet And Salt Lemonade");
        prod_42.setDescription("Zesty, thirst-quenching lemonades with a sparkling twist.");
        prod_42.setPrice(new BigDecimal("189"));
        prod_42.setIsAvailable(true);
        prod_42.setCategory(cat_8);
        productRepository.save(prod_42);

        Product prod_43 = new Product();
        prod_43.setId("p43");
        prod_43.setName("Nannari");
        prod_43.setDescription("Zesty, thirst-quenching lemonades with a sparkling twist.");
        prod_43.setPrice(new BigDecimal("189"));
        prod_43.setIsAvailable(true);
        prod_43.setCategory(cat_8);
        productRepository.save(prod_43);

        Product prod_44 = new Product();
        prod_44.setId("p44");
        prod_44.setName("Yuzu Orange Lemonade");
        prod_44.setDescription("Zesty, thirst-quenching lemonades with a sparkling twist.");
        prod_44.setPrice(new BigDecimal("189"));
        prod_44.setIsAvailable(true);
        prod_44.setCategory(cat_8);
        productRepository.save(prod_44);

        Category cat_9 = new Category();
        cat_9.setId("c9");
        cat_9.setName("Chillers - Virgin Mojito");
        cat_9.setDescription("Muddled mint and citrus coolers with refreshing fruit notes.");
        categoryRepository.save(cat_9);

        Product prod_45 = new Product();
        prod_45.setId("p45");
        prod_45.setName("Classic Mojito");
        prod_45.setDescription("Muddled mint and citrus coolers with refreshing fruit notes.");
        prod_45.setPrice(new BigDecimal("199"));
        prod_45.setIsAvailable(true);
        prod_45.setCategory(cat_9);
        productRepository.save(prod_45);

        Product prod_46 = new Product();
        prod_46.setId("p46");
        prod_46.setName("Blue Coral Mojito");
        prod_46.setDescription("Muddled mint and citrus coolers with refreshing fruit notes.");
        prod_46.setPrice(new BigDecimal("199"));
        prod_46.setIsAvailable(true);
        prod_46.setCategory(cat_9);
        productRepository.save(prod_46);

        Product prod_47 = new Product();
        prod_47.setId("p47");
        prod_47.setName("Yuzu Melon Mojito");
        prod_47.setDescription("Muddled mint and citrus coolers with refreshing fruit notes.");
        prod_47.setPrice(new BigDecimal("199"));
        prod_47.setIsAvailable(true);
        prod_47.setCategory(cat_9);
        productRepository.save(prod_47);

        Product prod_48 = new Product();
        prod_48.setId("p48");
        prod_48.setName("Apple Mojito");
        prod_48.setDescription("Muddled mint and citrus coolers with refreshing fruit notes.");
        prod_48.setPrice(new BigDecimal("199"));
        prod_48.setIsAvailable(true);
        prod_48.setCategory(cat_9);
        productRepository.save(prod_48);

        Category cat_10 = new Category();
        cat_10.setId("c10");
        cat_10.setName("Quick Bites");
        cat_10.setDescription("Hot and crispy snacks to perfectly complement your drink.");
        categoryRepository.save(cat_10);

        Product prod_49 = new Product();
        prod_49.setId("p49");
        prod_49.setName("French Fries");
        prod_49.setDescription("Hot and crispy snacks to perfectly complement your drink.");
        prod_49.setPrice(new BigDecimal("149"));
        prod_49.setIsAvailable(true);
        prod_49.setCategory(cat_10);
        productRepository.save(prod_49);

        Product prod_50 = new Product();
        prod_50.setId("p50");
        prod_50.setName("Hashbrowns");
        prod_50.setDescription("Hot and crispy snacks to perfectly complement your drink.");
        prod_50.setPrice(new BigDecimal("149"));
        prod_50.setIsAvailable(true);
        prod_50.setCategory(cat_10);
        productRepository.save(prod_50);

        Product prod_51 = new Product();
        prod_51.setId("p51");
        prod_51.setName("Potato Wedges");
        prod_51.setDescription("Hot and crispy snacks to perfectly complement your drink.");
        prod_51.setPrice(new BigDecimal("149"));
        prod_51.setIsAvailable(true);
        prod_51.setCategory(cat_10);
        productRepository.save(prod_51);

        Product prod_52 = new Product();
        prod_52.setId("p52");
        prod_52.setName("Cheese Shots");
        prod_52.setDescription("Hot and crispy snacks to perfectly complement your drink.");
        prod_52.setPrice(new BigDecimal("149"));
        prod_52.setIsAvailable(true);
        prod_52.setCategory(cat_10);
        productRepository.save(prod_52);

        Product prod_53 = new Product();
        prod_53.setId("p53");
        prod_53.setName("Sweet Corn");
        prod_53.setDescription("Hot and crispy snacks to perfectly complement your drink.");
        prod_53.setPrice(new BigDecimal("149"));
        prod_53.setIsAvailable(true);
        prod_53.setCategory(cat_10);
        productRepository.save(prod_53);

    }

    private void seedAdminUser() {
        if (adminEmail != null && !adminEmail.trim().isEmpty() && adminPassword != null && !adminPassword.trim().isEmpty()) {
            String cleanEmail = adminEmail.trim();
            java.util.Optional<User> existing = userRepository.findByEmail(cleanEmail);
            User admin;
            if (existing.isEmpty()) {
                admin = new User();
                admin.setUsername("Admin");
                admin.setEmail(cleanEmail);
                admin.setRole("ADMIN");
                admin.setLoyaltyPoints(0);
            } else {
                admin = existing.get();
                admin.setRole("ADMIN");
            }
            // Always update the password hash to ensure the Railway variable is the source of truth
            admin.setPasswordHash(passwordEncoder.encode(adminPassword.trim()));
            userRepository.save(admin);
        }
    }
}
