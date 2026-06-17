import os

menu_structure = [
    ("Milk Teas", "Classics", 249, [
        "Authentic Milk Tea",
        "Hong Kong Milk Tea",
        "Matcha Green Tea",
        "Oolong Milk Tea",
        "Taro Milk Tea",
        "Thai Milk Tea"
    ], "Premium loose-leaf teas perfectly brewed and blended with rich milk."),
    ("Milk Teas", "Flavoured", 269, [
        "Chocolate Milk Tea",
        "Strawberry Milk Tea",
        "Mango Milk Tea",
        "Rose Milk Tea",
        "Honeydew Milk Tea"
    ], "Sweet and refreshing fruit and flavor infusions mixed with our signature milk teas."),
    ("Fruit Teas", "Classics", 219, [
        "Peach Fruit Tea",
        "Passion Fruit Tea",
        "Lychee Fruit Tea",
        "Mango Fruit Tea",
        "Green Apple Fruit Tea",
        "Strawberry Fruit Tea"
    ], "Light, refreshing green teas infused with real fruit nectars."),
    ("Fruit Teas", "Premium", 249, [
        "Dragonfruit Lychee",
        "Grapefruit Yakult",
        "Mango Pomelo Sago",
        "Mixed Berry Blast",
        "Tropical Paradise"
    ], "Artisanal fruit tea blends with complex flavor profiles and premium ingredients."),
    ("Boba Shakes", "All Time Boba Milkshakes", 279, [
        "Vanilla Milkshake",
        "Chocolate Milkshake",
        "Strawberry Milkshake",
        "Blueberry Milkshake",
        "Lychee Milkshake",
        "Mango Milkshake"
    ], "Thick, creamy, and decadent milkshakes blended with chewy boba."),
    ("Boba Shakes", "Signature Boba Milk Shakes", 319, [
        "Ferrero Rocher Milkshake",
        "Caramel Popcorn Milkshake",
        "Oreo Milkshake",
        "Sea Salt Biscoff Milkshake"
    ], "Over-the-top signature shakes with premium toppings and drizzles."),
    ("Cold Coffee", "No Subcategory", 249, [
        "Cafe Frappe",
        "Almond Frappe",
        "Caramel Frappe",
        "Mocha Frappe",
        "Cookie And Cream Frappe",
        "Hazelnut Frappe",
        "Ferrero Rocher Frappe",
        "Biscoff Frappe"
    ], "Ice-blended coffee creations perfect for a hot day."),
    ("Chillers", "Lemonade", 189, [
        "Classic Lemonade",
        "Sweet And Salt Lemonade",
        "Nannari",
        "Yuzu Orange Lemonade"
    ], "Zesty, thirst-quenching lemonades with a sparkling twist."),
    ("Chillers", "Virgin Mojito", 199, [
        "Classic Mojito",
        "Blue Coral Mojito",
        "Yuzu Melon Mojito",
        "Apple Mojito"
    ], "Muddled mint and citrus coolers with refreshing fruit notes."),
    ("Quick Bites", "No Subcategory", 149, [
        "French Fries",
        "Hashbrowns",
        "Potato Wedges",
        "Cheese Shots",
        "Sweet Corn"
    ], "Hot and crispy snacks to perfectly complement your drink.")
]

java_code = """package com.popobob.config;

import com.popobob.model.Category;
import com.popobob.model.Product;
import com.popobob.repository.CategoryRepository;
import com.popobob.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) {
            return;
        }

"""

cat_id = 1
prod_id = 1

for cat_name, subcat, base_price, items, desc in menu_structure:
    cat_var = f"cat_{cat_id}"
    java_code += f'        Category {cat_var} = new Category();\n'
    java_code += f'        {cat_var}.setId("c{cat_id}");\n'
    if subcat != "No Subcategory":
        java_code += f'        {cat_var}.setName("{cat_name} - {subcat}");\n'
    else:
        java_code += f'        {cat_var}.setName("{cat_name}");\n'
    java_code += f'        {cat_var}.setDescription("{desc}");\n'
    java_code += f'        categoryRepository.save({cat_var});\n\n'
    
    for item_name in items:
        prod_var = f"prod_{prod_id}"
        java_code += f'        Product {prod_var} = new Product();\n'
        java_code += f'        {prod_var}.setId("p{prod_id}");\n'
        java_code += f'        {prod_var}.setName("{item_name}");\n'
        java_code += f'        {prod_var}.setDescription("{desc}");\n'
        java_code += f'        {prod_var}.setPrice(new BigDecimal("{base_price}"));\n'
        java_code += f'        {prod_var}.setIsAvailable(true);\n'
        java_code += f'        {prod_var}.setCategory({cat_var});\n'
        java_code += f'        productRepository.save({prod_var});\n\n'
        prod_id += 1
        
    cat_id += 1

java_code += """    }
}
"""

with open(r'backend\src\main\java\com\popobob\config\DataSeeder.java', 'w', encoding='utf-8') as f:
    f.write(java_code)
