package com.POP O'BOB®.controller;

import com.POP O'BOB®.model.Category;
import com.POP O'BOB®.model.Product;
import com.POP O'BOB®.service.MenuService;
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

    @org.springframework.web.bind.annotation.DeleteMapping("/categories/{id}")
    public void deleteCategory(@org.springframework.web.bind.annotation.PathVariable String id) {
        menuService.deleteCategory(id);
    }

    @org.springframework.web.bind.annotation.PostMapping("/products")
    public Product saveProduct(@org.springframework.web.bind.annotation.RequestBody Product product) {
        return menuService.saveProduct(product);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/products/{id}")
    public void deleteProduct(@org.springframework.web.bind.annotation.PathVariable String id) {
        menuService.deleteProduct(id);
    }
}
