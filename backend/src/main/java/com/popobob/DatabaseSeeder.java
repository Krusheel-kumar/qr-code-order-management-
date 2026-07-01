package com.popobob;

import com.popobob.model.Category;
import com.popobob.model.Product;
import com.popobob.repository.CategoryRepository;
import com.popobob.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if the database is completely empty to prevent overwriting user data
        if (productRepository.count() == 0) {
            System.out.println("Seeding database with full default menu...");
            
            productRepository.deleteAll();
            categoryRepository.deleteAll();

            Category milkTeas = new Category();
            milkTeas.setId("milk-teas");
            milkTeas.setName("Milk Teas");
            categoryRepository.save(milkTeas);

            // Classics
            String[] classics = {"Authentic milk tea", "Hong kong milk tea", "Taro milk tea", "Matcha milk tea", "Brown sugar milk tea"};
            for (String name : classics) {
                createProduct(name, milkTeas, "Classics");
            }

            // Fruit Series
            String[] fruits = {"Strawberry milk tea", "Mango milk tea", "Lychee milk tea", "Blueberry milk tea", "Honeydew milk tea"};
            for (String name : fruits) {
                createProduct(name, milkTeas, "Fruit Series");
            }

            // Chocolate
            String[] chocolates = {"Chocolate milk tea", "Choco fantasy milk tea", "Dark cocoa", "Choco caramel", "Nutella ferrero rocher", "Oreo", "Lotus biscoff"};
            for (String name : chocolates) {
                createProduct(name, milkTeas, "Chocolate");
            }

            // Coffee
            String[] coffees = {"Desi coffee", "Mocha", "Hazelnut", "Caramel coffee"};
            for (String name : coffees) {
                createProduct(name, milkTeas, "Coffee");
            }

            // Signatures
            String[] signatures = {"Sea salt biscoff", "Caramel popcorn", "Pistachio latte", "Tender coconut", "Mango pulp"};
            for (String name : signatures) {
                createProduct(name, milkTeas, "Signatures");
            }

            // --- BOBA ICED TEA ---
            Category bobaIcedTea = new Category();
            bobaIcedTea.setId("boba-iced-tea");
            bobaIcedTea.setName("Boba Iced Tea");
            categoryRepository.save(bobaIcedTea);

            String[] bobaClassics = {"Lemon", "Strawberry", "Orange", "Lychee", "Blueberry"};
            for (String name : bobaClassics) createProduct(name, bobaIcedTea, "Classic");

            String[] bobaSignatures = {"Apple Twist", "Elderflower", "Peach", "Pink Grapefruit", "Yuzu Berry"};
            for (String name : bobaSignatures) createProduct(name, bobaIcedTea, "Signature");

            // --- MILK SHAKES ---
            Category milkShakes = new Category();
            milkShakes.setId("milk-shakes");
            milkShakes.setName("Milk Shakes");
            categoryRepository.save(milkShakes);

            String[] allTimeMilkshakes = {"Vanilla", "Chocolate", "Strawberry", "Blueberry", "Lychee", "Mango"};
            for (String name : allTimeMilkshakes) createProduct(name, milkShakes, "All Time Milkshakes");

            String[] sigMilkshakes = {"Sea Salt Biscoff", "Ferrero Rocher", "Choco Fantasy", "Honey Dew", "Caramel Popcorn", "Oreo"};
            for (String name : sigMilkshakes) createProduct(name, milkShakes, "Signature Milkshakes");

            // --- COLD COFFEES ---
            Category coldCoffees = new Category();
            coldCoffees.setId("cold-coffees");
            coldCoffees.setName("Cold Coffees");
            categoryRepository.save(coldCoffees);

            String[] allTimeCoffees = {"Cafe Frappe", "Almond Frappe", "Caramel Frappe"};
            for (String name : allTimeCoffees) createProduct(name, coldCoffees, "All Time Cold Coffees");

            String[] sigCoffees = {"Cookie and Cream", "Mocha", "Hazelnut Frappe", "Ferrero Rocher", "Biscoff Frappe"};
            for (String name : sigCoffees) createProduct(name, coldCoffees, "Signature Cold Coffees");

            // --- CHILLERS ---
            Category chillers = new Category();
            chillers.setId("chillers");
            chillers.setName("Chillers");
            categoryRepository.save(chillers);

            String[] lemonades = {"Classic", "Sweet and Salt", "Nannari", "Yuzu", "Orange"};
            for (String name : lemonades) createProduct(name, chillers, "Lemonades");

            String[] mojitos = {"Classic", "Blue Coral", "Yuzu Melon", "Apple"};
            for (String name : mojitos) createProduct(name, chillers, "Virgin Mojitos");

            System.out.println("Database seeded successfully!");
        }
    }

    private void createProduct(String name, Category category, String subcategory) {
        Product p = new Product();
        p.setId("p-" + UUID.randomUUID().toString());
        p.setName(name);
        p.setCategory(category);
        p.setSubcategory(subcategory);
        p.setPrice(new BigDecimal("299"));
        p.setIsAvailable(true);
        p.setIsFeatured(false);
        p.setIsBestseller(false);
        p.setIsNewLaunch(false);
        productRepository.save(p);
    }
}
