package com.popobob.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

@Configuration
public class VectorDbConfig {

    private final JdbcTemplate jdbcTemplate;

    public VectorDbConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initVectorDatabase() {
        try {
            // Enable pgvector extension
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS vector;");
            
            // Recreate table with 3072 dimensions for gemini-embedding-2
            jdbcTemplate.execute("DROP TABLE IF EXISTS knowledge_base;");
            
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS knowledge_base (" +
                "id UUID DEFAULT gen_random_uuid() PRIMARY KEY, " +
                "type VARCHAR(50) NOT NULL, " +
                "content TEXT NOT NULL, " +
                "embedding vector(3072)" +
                ");"
            );
            System.out.println("Vector database configured successfully.");
        } catch (Exception e) {
            System.err.println("Failed to initialize vector database: " + e.getMessage());
        }
    }
}
