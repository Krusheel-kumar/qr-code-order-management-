package com.popobob.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        logger.info("=========================================");
        logger.info("Initializing Custom DataSource...");
        logger.info("Database URL: {}", properties.getUrl());
        logger.info("Database Username: {}", properties.getUsername());
        
        String password = properties.getPassword();
        if (password != null) {
            String trimmedPassword = password.trim();
            if (password.length() != trimmedPassword.length()) {
                logger.warn("WARNING: The database password contained leading/trailing whitespace or newlines. It has been automatically trimmed.");
            }
            properties.setPassword(trimmedPassword);
        } else {
            logger.warn("WARNING: Database password is null.");
        }
        logger.info("=========================================");

        return properties.initializeDataSourceBuilder().build();
    }
}
