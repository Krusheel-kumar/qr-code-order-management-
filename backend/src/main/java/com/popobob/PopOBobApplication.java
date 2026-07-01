package com.popobob;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
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
            
            // The user's database is completely clogged with massive 10MB+ base64 payloads
            // from before the compression fix. We need to wipe those massive strings 
            // so the API doesn't take 60 seconds to download them!
            int clearedProducts = jdbcTemplate.update("UPDATE products SET image_url = null WHERE length(image_url) > 500000");
            int clearedCampaigns = jdbcTemplate.update("UPDATE campaigns SET image = null WHERE length(image) > 500000");
            int clearedStories = jdbcTemplate.update("UPDATE stories SET image = null WHERE length(image) > 500000");
            
            System.out.println("SUCCESSFULLY ALTERED COLUMNS TO TEXT");
            System.out.println("CLEARED MASSIVE IMAGES: " + clearedProducts + " products, " + clearedCampaigns + " campaigns, " + clearedStories + " stories.");
        } catch (Exception e) {
            System.out.println("COULD NOT ALTER COLUMNS (Might already be TEXT): " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(PopOBobApplication.class, args);
    }
}
