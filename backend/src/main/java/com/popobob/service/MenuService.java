package com.popobob.service;

import com.popobob.model.Category;
import com.popobob.model.Product;
import com.popobob.repository.CategoryRepository;
import com.popobob.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findByIsAvailableTrue();
    }

    private final com.popobob.repository.DiscoverySectionRepository discoverySectionRepository;

    public Product saveProduct(Product product) {
        if (product.getImageUrl() != null && product.getImageUrl().startsWith("data:image")) {
            product.setImageUrl(cloudinaryService.uploadBase64Image(product.getImageUrl()));
        }
        if (product.getId() != null) {
            productRepository.findById(product.getId()).ifPresent(existing -> {
                if (product.getVersion() == null) {
                    product.setVersion(existing.getVersion() != null ? existing.getVersion() : 0);
                }
                // Preserve customization groups as they are managed via separate endpoints
                product.setCustomizationGroups(existing.getCustomizationGroups());
            });
        }
        
        // Attach discovery sections to avoid TransientObjectException
        if (product.getDiscoverySections() != null) {
            java.util.List<com.popobob.model.DiscoverySection> attachedSections = new java.util.ArrayList<>();
            for (com.popobob.model.DiscoverySection ds : product.getDiscoverySections()) {
                if (ds.getId() != null) {
                    discoverySectionRepository.findById(ds.getId()).ifPresent(attachedSections::add);
                }
            }
            product.setDiscoverySections(attachedSections);
        }
        
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
