package com.popobob;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PopOBobApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        try {
            // Fix schema types just in case
            jdbcTemplate.execute("ALTER TABLE campaigns ALTER COLUMN image TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE stories ALTER COLUMN image TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT");
            
            System.out.println("SUCCESSFULLY ALTERED COLUMNS TO TEXT");
        } catch (Exception e) {
            System.out.println("COULD NOT ALTER COLUMNS (Might already be TEXT): " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(PopOBobApplication.class, args);
    }
}
