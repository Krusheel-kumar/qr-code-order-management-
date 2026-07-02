package com.popobob.controller;

import com.popobob.model.Campaign;
import com.popobob.model.Product;
import com.popobob.model.Story;
import com.popobob.repository.CampaignRepository;
import com.popobob.repository.ProductRepository;
import com.popobob.repository.StoryRepository;
import com.popobob.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class MigrationController {

    private final ProductRepository productRepository;
    private final CampaignRepository campaignRepository;
    private final StoryRepository storyRepository;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/migrate-images")
    public Map<String, Integer> migrateImages() {
        int productsMigrated = 0;
        int campaignsMigrated = 0;
        int storiesMigrated = 0;

        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            if (product.getImageUrl() != null && product.getImageUrl().startsWith("data:image")) {
                product.setImageUrl(cloudinaryService.uploadBase64Image(product.getImageUrl()));
                productRepository.save(product);
                productsMigrated++;
            }
        }

        List<Campaign> campaigns = campaignRepository.findAll();
        for (Campaign campaign : campaigns) {
            if (campaign.getImage() != null && campaign.getImage().startsWith("data:image")) {
                campaign.setImage(cloudinaryService.uploadBase64Image(campaign.getImage()));
                campaignRepository.save(campaign);
                campaignsMigrated++;
            }
        }

        List<Story> stories = storyRepository.findAll();
        for (Story story : stories) {
            if (story.getImage() != null && story.getImage().startsWith("data:image")) {
                story.setImage(cloudinaryService.uploadBase64Image(story.getImage()));
                storyRepository.save(story);
                storiesMigrated++;
            }
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("productsMigrated", productsMigrated);
        result.put("campaignsMigrated", campaignsMigrated);
        result.put("storiesMigrated", storiesMigrated);
        return result;
    }
}
