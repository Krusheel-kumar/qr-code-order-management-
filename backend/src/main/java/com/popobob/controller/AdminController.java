package com.popobob.controller;

import com.popobob.model.*;
import com.popobob.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CampaignRepository campaignRepository;
    private final StoryRepository storyRepository;
    private final StoreSettingsRepository storeSettingsRepository;
    private final CouponRepository couponRepository;
    private final AddonRepository addonRepository;

    // Campaigns
    @GetMapping("/campaigns")
    public List<Campaign> getCampaigns() {
        return campaignRepository.findAll();
    }

    @PostMapping("/campaigns")
    public Campaign saveCampaign(@RequestBody Campaign campaign) {
        return campaignRepository.save(campaign);
    }

    @DeleteMapping("/campaigns/{id}")
    public void deleteCampaign(@PathVariable String id) {
        campaignRepository.deleteById(id);
    }

    // Stories
    @GetMapping("/stories")
    public List<Story> getStories() {
        return storyRepository.findAll();
    }

    @PostMapping("/stories")
    public Story saveStory(@RequestBody Story story) {
        return storyRepository.save(story);
    }

    @DeleteMapping("/stories/{id}")
    public void deleteStory(@PathVariable String id) {
        storyRepository.deleteById(id);
    }

    // Store Settings
    @GetMapping("/settings")
    public StoreSettings getSettings() {
        return storeSettingsRepository.findById(1L).orElse(new StoreSettings());
    }

    @PostMapping("/settings")
    public StoreSettings saveSettings(@RequestBody StoreSettings settings) {
        settings.setId(1L);
        return storeSettingsRepository.save(settings);
    }

    // Coupons
    @GetMapping("/coupons")
    public List<Coupon> getCoupons() {
        return couponRepository.findAll();
    }

    @PostMapping("/coupons")
    public Coupon saveCoupon(@RequestBody Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @DeleteMapping("/coupons/{id}")
    public void deleteCoupon(@PathVariable String id) {
        couponRepository.deleteById(id);
    }

    // Addons
    @GetMapping("/addons")
    public List<Addon> getAddons() {
        return addonRepository.findAll();
    }

    @PostMapping("/addons")
    public Addon saveAddon(@RequestBody Addon addon) {
        return addonRepository.save(addon);
    }

    @DeleteMapping("/addons/{id}")
    public void deleteAddon(@PathVariable String id) {
        addonRepository.deleteById(id);
    }
}
