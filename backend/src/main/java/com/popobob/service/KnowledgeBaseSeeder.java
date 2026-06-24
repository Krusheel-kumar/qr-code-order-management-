package com.popobob.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class KnowledgeBaseSeeder {

    private final JdbcTemplate jdbcTemplate;
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    public KnowledgeBaseSeeder(JdbcTemplate jdbcTemplate, AiService aiService) {
        this.jdbcTemplate = jdbcTemplate;
        this.aiService = aiService;
        this.objectMapper = new ObjectMapper();
    }

    // @PostConstruct
    public void seedKnowledgeBase() {
        try {
            // Check if knowledge base is empty
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM knowledge_base", Integer.class);
            if (count != null && count > 0) {
                System.out.println("Knowledge Base is already seeded with " + count + " records.");
                return;
            }

            System.out.println("Knowledge Base is empty. Starting seeding process...");

            // Read the JSON file
            InputStream inputStream = new ClassPathResource("knowledge_data.json").getInputStream();
            List<Map<String, String>> knowledgeList = objectMapper.readValue(inputStream, new TypeReference<>() {});

            for (Map<String, String> knowledge : knowledgeList) {
                String type = knowledge.get("type");
                String content = knowledge.get("content");

                // Get embedding from Gemini API
                List<Float> embedding = aiService.embedText(content);
                String embeddingString = embedding.toString();

                // Insert into vector database
                jdbcTemplate.update(
                    "INSERT INTO knowledge_base (type, content, embedding) VALUES (?, ?, CAST(? AS vector))",
                    type, content, embeddingString
                );
            }

            System.out.println("Knowledge Base seeded successfully with " + knowledgeList.size() + " records.");

        } catch (Exception e) {
            System.err.println("Failed to seed knowledge base: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
