package com.popobob.controller;

import com.popobob.model.StoreSettings;
import com.popobob.repository.StoreSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public endpoints accessible without authentication.
 * These expose only the minimum data needed by the customer-facing website.
 * Do NOT add any write operations or sensitive admin data here.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final StoreSettingsRepository storeSettingsRepository;

    /**
     * Returns the store open/closed status and pricing fields needed by the customer cart.
     * Exposed without authentication so the customer website can read it.
     * Only non-sensitive operational data is included.
     */
    @GetMapping("/store-status")
    public Map<String, Object> getStoreStatus() {
        StoreSettings settings = storeSettingsRepository.findById(1L)
                .orElse(new StoreSettings());
        return Map.of(
                "storeActive",    settings.getStoreActive() != null ? settings.getStoreActive() : true,
                "taxRate",        settings.getTaxRate()        != null ? settings.getTaxRate()        : 5.0,
                "deliveryFee",    settings.getDeliveryFee()    != null ? settings.getDeliveryFee()    : 40.0,
                "packingCharge",  settings.getPackingCharge()  != null ? settings.getPackingCharge()  : 15.0,
                "prepTime",       settings.getPrepTime()       != null ? settings.getPrepTime()       : 15
        );
    }
}
