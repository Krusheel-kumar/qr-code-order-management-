package com.popobob.controller;

import com.popobob.model.CustomizationGroup;
import com.popobob.model.Product;
import com.popobob.repository.CustomizationGroupRepository;
import com.popobob.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/admin/products/{productId}/customization-groups")
@RequiredArgsConstructor
public class ProductCustomizationMappingController {

    private final ProductRepository productRepository;
    private final CustomizationGroupRepository groupRepository;

    @PostMapping
    public ResponseEntity<?> assignGroup(
            @PathVariable String productId,
            @RequestBody Map<String, String> payload) {
        
        String groupId = payload.get("customizationGroupId");
        if (groupId == null) {
            return ResponseEntity.status(400).body(Map.of("message", "customizationGroupId is required"));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        CustomizationGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Customization Group not found: " + groupId));

        if (product.getCustomizationGroups() == null) {
            product.setCustomizationGroups(new ArrayList<>());
        }

        if (product.getCustomizationGroups().contains(group)) {
            return ResponseEntity.status(400).body(Map.of("message", "Customization Group already mapped to this product"));
        }

        product.getCustomizationGroups().add(group);
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved.getCustomizationGroups());
    }

    @GetMapping
    public ResponseEntity<?> getAssignedGroups(@PathVariable String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        
        List<CustomizationGroup> groups = product.getCustomizationGroups();
        return ResponseEntity.ok(groups != null ? groups : new ArrayList<>());
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> removeGroup(
            @PathVariable String productId,
            @PathVariable String groupId) {
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        CustomizationGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Customization Group not found: " + groupId));

        if (product.getCustomizationGroups() != null && product.getCustomizationGroups().contains(group)) {
            product.getCustomizationGroups().remove(group);
            productRepository.save(product);
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<?> reorderGroups(
            @PathVariable String productId,
            @RequestBody Map<String, List<String>> payload) {
        
        List<String> groupIds = payload.get("groupIds");
        if (groupIds == null) {
            return ResponseEntity.status(400).body(Map.of("message", "groupIds is required"));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        List<CustomizationGroup> reorderedList = new ArrayList<>();
        for (String id : groupIds) {
            CustomizationGroup group = groupRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Customization Group not found: " + id));
            
            if (product.getCustomizationGroups() == null || !product.getCustomizationGroups().contains(group)) {
                return ResponseEntity.status(400).body(Map.of("message", "Group " + id + " is not mapped to this product"));
            }
            reorderedList.add(group);
        }

        // Verify no elements were omitted
        if (reorderedList.size() != product.getCustomizationGroups().size()) {
            return ResponseEntity.status(400).body(Map.of("message", "All currently mapped groups must be included in the reorder list"));
        }

        product.setCustomizationGroups(reorderedList);
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved.getCustomizationGroups());
    }
}
