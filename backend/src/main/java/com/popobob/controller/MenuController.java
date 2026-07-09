package com.popobob.controller;

import com.popobob.model.Category;
import com.popobob.model.Product;
import com.popobob.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {
    
    private final MenuService menuService;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return menuService.getAllCategories();
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return menuService.getAvailableProducts();
    }

    // --- Admin Endpoints ---

    @GetMapping("/admin/products")
    public List<Product> getAllProducts() {
        return menuService.getAllProducts();
    }

    @org.springframework.web.bind.annotation.PostMapping("/categories")
    public Category saveCategory(@org.springframework.web.bind.annotation.RequestBody Category category) {
        return menuService.saveCategory(category);
    }
    
    @org.springframework.web.bind.annotation.PutMapping("/categories/{id}")
    public Category updateCategory(@org.springframework.web.bind.annotation.PathVariable String id, @org.springframework.web.bind.annotation.RequestBody Category category) {
        category.setId(id);
        return menuService.saveCategory(category);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/categories/{id}")
    public void deleteCategory(@org.springframework.web.bind.annotation.PathVariable String id) {
        menuService.deleteCategory(id);
    }

    @org.springframework.web.bind.annotation.PostMapping("/products")
    public Product saveProduct(@org.springframework.web.bind.annotation.RequestBody String rawBody) {
        System.out.println("========== RAW BODY START ==========");
        System.out.println(rawBody);
        System.out.println("========== RAW BODY END ==========");
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Product product = mapper.readValue(rawBody, Product.class);
            return menuService.saveProduct(product);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Parse error", e);
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/products/{id}")
    public void deleteProduct(@org.springframework.web.bind.annotation.PathVariable String id) {
        menuService.deleteProduct(id);
    }
}
