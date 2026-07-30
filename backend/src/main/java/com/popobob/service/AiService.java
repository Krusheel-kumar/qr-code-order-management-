package com.popobob.service;

import com.popobob.dto.AiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import jakarta.annotation.PostConstruct;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private JsonNode productsCatalog;

    public AiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("products.json");
            InputStream is = resource.getInputStream();
            JsonNode rootNode = objectMapper.readTree(is);
            
            // Clean up the catalog by removing imageUrl to save tokens
            if (rootNode.isArray()) {
                ArrayNode arrayNode = (ArrayNode) rootNode;
                for (JsonNode node : arrayNode) {
                    if (node.isObject()) {
                        ((ObjectNode) node).remove("imageUrl");
                    }
                }
            }
            this.productsCatalog = rootNode;
            System.out.println("Successfully loaded and sanitized products.json with " + productsCatalog.size() + " items.");
        } catch (Exception e) {
            System.err.println("Failed to load products.json: " + e.getMessage());
            this.productsCatalog = objectMapper.createArrayNode();
        }
    }

    private String filterRelevantProducts(String craving) {
        String[] queryTokens = craving.toLowerCase().split("\\s+");
        ArrayNode relevantProducts = objectMapper.createArrayNode();
        
        if (productsCatalog.isArray()) {
            for (JsonNode product : productsCatalog) {
                boolean match = false;
                
                String name = product.path("name").asText("").toLowerCase();
                String category = product.path("category").path("name").asText("").toLowerCase();
                String description = product.path("description").asText("").toLowerCase();
                
                for (String token : queryTokens) {
                    // Ignore very short common words for matching
                    if (token.length() <= 2) continue;
                    
                    if (name.contains(token) || category.contains(token) || description.contains(token)) {
                        match = true;
                        break;
                    }
                    
                    // Check flavor notes
                    JsonNode flavorNotes = product.path("flavorNotes");
                    if (flavorNotes.isArray()) {
                        for (JsonNode note : flavorNotes) {
                            if (note.asText("").toLowerCase().contains(token)) {
                                match = true;
                                break;
                            }
                        }
                    }
                    if (match) break;
                }
                
                if (match) {
                    relevantProducts.add(product);
                }
            }
        }
        
        // If nothing matches specifically, we can just send the top 10 products as a fallback
        if (relevantProducts.isEmpty() && productsCatalog.isArray()) {
            int count = 0;
            for (JsonNode product : productsCatalog) {
                if (count >= 10) break;
                relevantProducts.add(product);
                count++;
            }
        } else if (relevantProducts.size() > 15) {
            // Trim to top 15 to avoid token limits even further
            ArrayNode trimmed = objectMapper.createArrayNode();
            for (int i = 0; i < 15; i++) {
                trimmed.add(relevantProducts.get(i));
            }
            relevantProducts = trimmed;
        }
        
        try {
            return objectMapper.writeValueAsString(relevantProducts);
        } catch (Exception e) {
            return "[]";
        }
    }

    public AiResponse recommendDrink(String craving) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            throw new RuntimeException("Gemini API key is not configured.");
        }

        String relevantProductsJson = filterRelevantProducts(craving);

        String prompt = "You are an expert Boba Barista AI named 'POB AI' for the premium bubble tea shop 'POP O'BOB®'.\n" +
            "Your job is to recommend 2 to 5 drinks from our menu based on the user's craving. If only 1 drink matches perfectly, recommend just 1.\n\n" +
            "### RELEVANT STORE MENU ###\n" +
            "Use the following matching menu items to answer the user's request accurately:\n" +
            relevantProductsJson + "\n\n" +
            "### RULES ###\n" +
            "1. You MUST pick 1 to 5 product IDs from the provided menu items. Never invent a product.\n" +
            "2. Keep your 'reason' short, playful, friendly, and tailored to POP O'BOB®. Explain why you chose these drinks.\n\n" +
            "### ACTUAL REQUEST ###\n" +
            "The user is craving/asking: \"" + craving + "\"\n" +
            "Respond strictly in valid JSON format. The JSON must have exactly two keys: 'productIds' (which should contain an array of the exact product IDs) and 'reason' (your short conversational message).\n";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

        try {
            Map<String, Object> requestBody = new HashMap<>();
            
            // Build contents array
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);
            Map<String, Object> content = new HashMap<>();
            content.put("parts", new Object[]{parts});
            requestBody.put("contents", new Object[]{content});
            
            // Set generation config for JSON with schema
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            
            Map<String, Object> responseSchema = new HashMap<>();
            responseSchema.put("type", "OBJECT");
            Map<String, Object> properties = new HashMap<>();
            Map<String, Object> productIdsSchema = new HashMap<>();
            productIdsSchema.put("type", "ARRAY");
            productIdsSchema.put("items", Map.of("type", "STRING"));
            properties.put("productIds", productIdsSchema);
            properties.put("reason", Map.of("type", "STRING"));
            responseSchema.put("properties", properties);
            responseSchema.put("required", List.of("productIds", "reason"));
            
            generationConfig.put("responseSchema", responseSchema);
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            String responseBody = response.getBody();
            System.out.println("RAW GEMINI RESPONSE: " + responseBody);
            
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode candidates = rootNode.path("candidates");
            
            if (candidates.isMissingNode() || !candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("Gemini returned an empty candidates array. Raw response: " + responseBody);
            }
            
            String textResponse = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean up possible markdown code blocks just in case
            textResponse = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            
            // Ensure Jackson ignores any extra fields Gemini might randomly add
            objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            
            AiResponse aiResponse = objectMapper.readValue(textResponse, AiResponse.class);
            return aiResponse;
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            System.err.println("Gemini API HTTP Error: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 429) {
                throw new RuntimeException("Gemini API is experiencing rate limiting (Too Many Requests). Please wait a few seconds and try again.");
            }
            throw new RuntimeException("Gemini API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get recommendation from AI: " + e.getMessage(), e);
        }
    }
}
