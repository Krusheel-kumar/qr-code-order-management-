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
    private final DiscoverySectionRepository discoverySectionRepository;
    private final com.popobob.service.CloudinaryService cloudinaryService;

    // Discovery Sections
    @GetMapping("/discovery-sections")
    public List<DiscoverySection> getDiscoverySections() {
        return discoverySectionRepository.findAllByOrderByDisplayOrderAsc();
    }

    @PostMapping("/discovery-sections")
    public DiscoverySection saveDiscoverySection(@RequestBody DiscoverySection section) {
        return discoverySectionRepository.save(section);
    }

    @DeleteMapping("/discovery-sections/{id}")
    public void deleteDiscoverySection(@PathVariable String id) {
        discoverySectionRepository.deleteById(id);
    }

    // Campaigns
    @GetMapping("/campaigns")
    public List<Campaign> getCampaigns() {
        return campaignRepository.findAll();
    }

    @PostMapping("/campaigns")
    public Campaign saveCampaign(@RequestBody Campaign campaign) {
        if (campaign.getImage() != null && campaign.getImage().startsWith("data:image")) {
            campaign.setImage(cloudinaryService.uploadBase64Image(campaign.getImage()));
        }
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
        if (story.getImage() != null && story.getImage().startsWith("data:image")) {
            story.setImage(cloudinaryService.uploadBase64Image(story.getImage()));
        }
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
