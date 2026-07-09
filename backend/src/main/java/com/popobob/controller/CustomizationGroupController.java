package com.popobob.controller;

import com.popobob.dto.CustomizationGroupDto;
import com.popobob.model.CustomizationGroup;
import com.popobob.repository.CustomizationGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/admin/customization-groups")
@RequiredArgsConstructor
public class CustomizationGroupController {

    private final CustomizationGroupRepository groupRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<?> createGroup(@Validated @RequestBody CustomizationGroupDto dto) {
        if (groupRepository.existsById(dto.getId())) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", "Customization Group with ID already exists"));
        }
        if (dto.getMinSelections() != null && dto.getMaxSelections() != null && dto.getMinSelections() > dto.getMaxSelections()) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", "Min selections cannot be greater than Max selections"));
        }
        if (dto.getFreeSelectionsLimit() != null && dto.getMaxSelections() != null && dto.getFreeSelectionsLimit() > dto.getMaxSelections()) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", "Free selections limit cannot be greater than Max selections"));
        }
        CustomizationGroup group = new CustomizationGroup();
        group.setId(dto.getId());
        group.setName(dto.getName());
        group.setMinSelections(dto.getMinSelections());
        group.setMaxSelections(dto.getMaxSelections());
        group.setFreeSelectionsLimit(dto.getFreeSelectionsLimit());
        group.setIsRequired(dto.getIsRequired());

        CustomizationGroup saved = groupRepository.save(group);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<CustomizationGroup>> getAllGroups() {
        return ResponseEntity.ok(groupRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroup(@PathVariable String id) {
        return groupRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable String id, @Validated @RequestBody CustomizationGroupDto dto) {
        if (dto.getMinSelections() != null && dto.getMaxSelections() != null && dto.getMinSelections() > dto.getMaxSelections()) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", "Min selections cannot be greater than Max selections"));
        }
        if (dto.getFreeSelectionsLimit() != null && dto.getMaxSelections() != null && dto.getFreeSelectionsLimit() > dto.getMaxSelections()) {
            return ResponseEntity.status(400).body(java.util.Map.of("message", "Free selections limit cannot be greater than Max selections"));
        }
        return groupRepository.findById(id)
                .map(group -> {
                    group.setName(dto.getName());
                    group.setMinSelections(dto.getMinSelections());
                    group.setMaxSelections(dto.getMaxSelections());
                    group.setFreeSelectionsLimit(dto.getFreeSelectionsLimit());
                    group.setIsRequired(dto.getIsRequired());
                    
                    CustomizationGroup saved = groupRepository.save(group);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable String id) {
        return groupRepository.findById(id)
                .map(group -> {
                    try {
                        // Forcefully delete references in menu_item_customizations to avoid constraint errors
                        jdbcTemplate.update("DELETE FROM menu_item_customizations WHERE customization_group_id = ?", id);
                        
                        groupRepository.delete(group);
                        return ResponseEntity.ok().build();
                    } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        return ResponseEntity.status(409).body(java.util.Map.of("message", "Failed to delete group due to constraint violation."));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
