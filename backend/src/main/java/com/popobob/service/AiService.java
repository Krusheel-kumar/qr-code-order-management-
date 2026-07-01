package com.popobob.service;

import com.popobob.dto.AiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<Float> embedText(String text) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            throw new RuntimeException("Gemini API key is not configured.");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=" + geminiApiKey;

        try {
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", text);
            Map<String, Object> content = new HashMap<>();
            content.put("parts", new Object[]{parts});
            requestBody.put("content", content);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            
            JsonNode valuesNode = rootNode.path("embedding").path("values");
            List<Float> embedding = objectMapper.convertValue(valuesNode, objectMapper.getTypeFactory().constructCollectionType(List.class, Float.class));
            return embedding;
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate embedding: " + e.getMessage());
        }
    }

    public AiResponse recommendDrink(String craving) {
        if (groqApiKey == null || groqApiKey.isEmpty()) {
            throw new RuntimeException("Groq API key is not configured.");
        }

        // 1. Generate embedding for the user's craving (still using Gemini for this)
        List<Float> queryEmbedding = embedText(craving);
        String embeddingString = queryEmbedding.toString();

        // 2. Query the Vector DB for the top 5 most relevant pieces of knowledge
        String sql = "SELECT content FROM knowledge_base ORDER BY embedding <=> CAST(? AS vector) LIMIT 5";
        List<String> relevantFacts = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> rs.getString("content"),
            embeddingString
        );

        StringBuilder knowledgeContext = new StringBuilder();
        for (String fact : relevantFacts) {
            knowledgeContext.append("- ").append(fact).append("\n");
        }

        // 3. Construct the RAG Prompt
        String prompt = "You are an expert Boba Barista AI named 'POB AI' for the premium bubble tea shop 'POP O'BOB®'.\n" +
            "Your job is to recommend exactly ONE drink from our menu based on the user's craving or answer their question.\n\n" +
            "### RELEVANT STORE KNOWLEDGE ###\n" +
            "Use the following retrieved facts from our database to answer the user's request accurately:\n" +
            knowledgeContext.toString() + "\n" +
            "### RULES ###\n" +
            "1. You MUST pick a product mentioned in the retrieved facts or menu. Never invent a product.\n" +
            "2. Ensure you strictly follow any AI Recommendation Rules provided in the knowledge base.\n" +
            "3. Keep your 'reason' short, playful, friendly, and tailored to POP O'BOB®.\n\n" +
            "### ACTUAL REQUEST ###\n" +
            "The user is craving/asking: \"" + craving + "\"\n" +
            "Respond strictly in valid JSON format with no markdown formatting. The JSON must have exactly two keys: 'productId' (which should contain the exact name of the product) and 'reason'.\n";

        String url = "https://api.groq.com/openai/v1/chat/completions";

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.1-8b-instant");
            
            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            
            requestBody.put("messages", new Object[]{message});
            // We use JSON mode to ensure the output is valid JSON
            Map<String, String> responseFormat = new HashMap<>();
            responseFormat.put("type", "json_object");
            requestBody.put("response_format", responseFormat);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            String responseBody = response.getBody();
            System.out.println("RAW GROQ RESPONSE: " + responseBody);
            
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode choices = rootNode.path("choices");
            
            if (choices.isMissingNode() || !choices.isArray() || choices.isEmpty()) {
                throw new RuntimeException("Groq returned an empty choices array. Raw response: " + responseBody);
            }
            
            JsonNode messageNode = choices.get(0).path("message");
            String textResponse = messageNode.path("content").asText();
            
            // Clean up possible markdown code blocks
            textResponse = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            
            AiResponse aiResponse = objectMapper.readValue(textResponse, AiResponse.class);
            return aiResponse;
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            System.err.println("Groq API HTTP Error: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 429) {
                throw new RuntimeException("Groq API is experiencing rate limiting (Too Many Requests). Please wait a few seconds and try again.");
            }
            throw new RuntimeException("Groq API error: " + e.getStatusCode());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get recommendation from AI: " + e.getMessage(), e);
        }
    }
}
