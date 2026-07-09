package com.popobob.controller;

import com.popobob.model.Store;
import com.popobob.repository.StoreRepository;
import com.popobob.repository.ProductRepository;
import com.popobob.repository.CustomizationOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/admin/stores/{storeId}/blacklist")
@RequiredArgsConstructor
public class StoreBlacklistController {

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final CustomizationOptionRepository optionRepository;

    private Store getOrCreateStore(String storeId) {
        return storeRepository.findById(storeId)
                .orElseGet(() -> {
                    Store newStore = new Store();
                    newStore.setId(storeId);
                    newStore.setName("POP O'BOB Branch #" + storeId);
                    newStore.setAddress("Seeded Store Address");
                    newStore.setIsActive(true);
                    return storeRepository.save(newStore);
                });
    }

    // --- Product Blacklists ---

    @PostMapping("/products")
    public ResponseEntity<?> blacklistProduct(
            @PathVariable String storeId,
            @RequestBody Map<String, String> payload) {
        
        String productId = payload.get("productId");
        if (productId == null) {
            return ResponseEntity.status(400).body(Map.of("message", "productId is required"));
        }

        Store store = getOrCreateStore(storeId);

        if (!productRepository.existsById(productId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Product not found: " + productId));
        }

        if (store.getBlacklistedProductIds().contains(productId)) {
            return ResponseEntity.status(400).body(Map.of("message", "Product is already blacklisted at this store"));
        }

        store.getBlacklistedProductIds().add(productId);
        storeRepository.save(store);
        return ResponseEntity.ok(store.getBlacklistedProductIds());
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> removeProductFromBlacklist(
            @PathVariable String storeId,
            @PathVariable String productId) {

        Store store = getOrCreateStore(storeId);

        if (store.getBlacklistedProductIds().contains(productId)) {
            store.getBlacklistedProductIds().remove(productId);
            storeRepository.save(store);
        }
        return ResponseEntity.ok(store.getBlacklistedProductIds());
    }

    @GetMapping("/products")
    public ResponseEntity<List<String>> getBlacklistedProducts(@PathVariable String storeId) {
        Store store = getOrCreateStore(storeId);
        return ResponseEntity.ok(store.getBlacklistedProductIds());
    }

    // --- Option Blacklists ---

    @PostMapping("/options")
    public ResponseEntity<?> blacklistOption(
            @PathVariable String storeId,
            @RequestBody Map<String, String> payload) {
        
        String optionId = payload.get("optionId");
        if (optionId == null) {
            return ResponseEntity.status(400).body(Map.of("message", "optionId is required"));
        }

        Store store = getOrCreateStore(storeId);

        if (!optionRepository.existsById(optionId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Customization Option not found: " + optionId));
        }

        if (store.getBlacklistedOptionIds().contains(optionId)) {
            return ResponseEntity.status(400).body(Map.of("message", "Customization Option is already blacklisted at this store"));
        }

        store.getBlacklistedOptionIds().add(optionId);
        storeRepository.save(store);
        return ResponseEntity.ok(store.getBlacklistedOptionIds());
    }

    @DeleteMapping("/options/{optionId}")
    public ResponseEntity<?> removeOptionFromBlacklist(
            @PathVariable String storeId,
            @PathVariable String optionId) {

        Store store = getOrCreateStore(storeId);

        if (store.getBlacklistedOptionIds().contains(optionId)) {
            store.getBlacklistedOptionIds().remove(optionId);
            storeRepository.save(store);
        }
        return ResponseEntity.ok(store.getBlacklistedOptionIds());
    }

    @GetMapping("/options")
    public ResponseEntity<List<String>> getBlacklistedOptions(@PathVariable String storeId) {
        Store store = getOrCreateStore(storeId);
        return ResponseEntity.ok(store.getBlacklistedOptionIds());
    }
}
