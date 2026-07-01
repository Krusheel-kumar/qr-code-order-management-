package com.POP O'BOB®.controller;

import com.POP O'BOB®.model.DiscoverySection;
import com.POP O'BOB®.model.Campaign;
import com.POP O'BOB®.model.Story;
import com.POP O'BOB®.repository.DiscoverySectionRepository;
import com.POP O'BOB®.repository.CampaignRepository;
import com.POP O'BOB®.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/discovery")
@RequiredArgsConstructor
public class DiscoveryController {

    private final DiscoverySectionRepository discoverySectionRepository;
    private final CampaignRepository campaignRepository;
    private final StoryRepository storyRepository;

    @GetMapping("/sections")
    public List<DiscoverySection> getActiveSections() {
        return discoverySectionRepository.findByIsActiveOrderByDisplayOrderAsc(true);
    }

    @GetMapping("/campaigns")
    public List<Campaign> getCampaigns() {
        return campaignRepository.findAll();
    }

    @GetMapping("/stories")
    public List<Story> getStories() {
        return storyRepository.findAll();
    }
}
