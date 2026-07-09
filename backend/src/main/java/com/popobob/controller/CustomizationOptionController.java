package com.popobob.controller;

import com.popobob.dto.CustomizationOptionDto;
import com.popobob.model.CustomizationGroup;
import com.popobob.model.CustomizationOption;
import com.popobob.repository.CustomizationGroupRepository;
import com.popobob.repository.CustomizationOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/admin/customization-options")
@RequiredArgsConstructor
public class CustomizationOptionController {

    private final CustomizationOptionRepository optionRepository;
    private final CustomizationGroupRepository groupRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<?> createOption(@Validated @RequestBody CustomizationOptionDto dto) {
        if (optionRepository.existsById(dto.getId())) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", "Customization Option with ID already exists"));
        }
        CustomizationGroup group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Parent Customization Group not found: " + dto.getGroupId()));

        CustomizationOption option = new CustomizationOption();
        option.setId(dto.getId());
        option.setGroup(group);
        option.setName(dto.getName());
        option.setDefaultPrice(dto.getDefaultPrice());
        option.setIsAvailable(dto.getIsAvailable());
        option.setBadgeEnabled(dto.getBadgeEnabled());
        option.setBadgeType(dto.getBadgeType());
        option.setBadgeColor(dto.getBadgeColor());
        option.setBadgeIcon(dto.getBadgeIcon());
        option.setBadgePriority(dto.getBadgePriority());

        CustomizationOption saved = optionRepository.save(option);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<CustomizationOption>> getAllOptions() {
        return ResponseEntity.ok(optionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOption(@PathVariable String id) {
        return optionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOption(@PathVariable String id, @Validated @RequestBody CustomizationOptionDto dto) {
        return optionRepository.findById(id)
                .map(option -> {
                    if (!option.getGroup().getId().equals(dto.getGroupId())) {
                        CustomizationGroup group = groupRepository.findById(dto.getGroupId())
                                .orElseThrow(() -> new IllegalArgumentException("Parent Customization Group not found: " + dto.getGroupId()));
                        option.setGroup(group);
                    }
                    option.setName(dto.getName());
                    option.setDefaultPrice(dto.getDefaultPrice());
                    option.setIsAvailable(dto.getIsAvailable());
                    option.setBadgeEnabled(dto.getBadgeEnabled());
                    option.setBadgeType(dto.getBadgeType());
                    option.setBadgeColor(dto.getBadgeColor());
                    option.setBadgeIcon(dto.getBadgeIcon());
                    option.setBadgePriority(dto.getBadgePriority());
                    
                    CustomizationOption saved = optionRepository.save(option);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOption(@PathVariable String id) {
        return optionRepository.findById(id)
                .map(option -> {
                    try {
                        // Forcefully delete references in store_option_blacklists to avoid constraint errors
                        jdbcTemplate.update("DELETE FROM store_option_blacklists WHERE option_id = ?", id);
                        
                        optionRepository.delete(option);
                        return ResponseEntity.ok().build();
                    } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        return ResponseEntity.status(409).body(java.util.Map.of("message", "Failed to delete option due to constraint violation."));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
