package com.popobob.controller;

import com.popobob.model.DiscoverySection;
import com.popobob.model.Campaign;
import com.popobob.model.Story;
import com.popobob.repository.DiscoverySectionRepository;
import com.popobob.repository.CampaignRepository;
import com.popobob.repository.StoryRepository;
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
