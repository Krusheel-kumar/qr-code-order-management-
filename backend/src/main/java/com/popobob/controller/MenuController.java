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
}
