package com.popobob.service;

import com.popobob.dto.AiResponse;
import com.popobob.model.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final MenuService menuService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiService(MenuService menuService) {
        this.menuService = menuService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AiResponse recommendDrink(String craving) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            throw new RuntimeException("Gemini API key is not configured.");
        }

        String menuStr = "[\n" +
            "  {id: 'p1', name: 'Brown Sugar Boba'},\n" +
            "  {id: 'p2', name: 'Ferrero Boba'},\n" +
            "  {id: 'p3', name: 'Matcha Boba'},\n" +
            "  {id: 'p4', name: 'Mango Fruit Tea'},\n" +
            "  {id: 'p5', name: 'Yuzu Iced Boba Tea'},\n" +
            "  {id: 'p6', name: 'Elderflower Iced Boba Tea'},\n" +
            "  {id: 'p7', name: 'Pink Grapefruit Iced Boba Tea'},\n" +
            "  {id: 'p8', name: 'Lotus Biscoff Boba Tea'},\n" +
            "  {id: 'p9', name: 'Sea Salt Biscoff Boba Tea'}\n" +
            "]";

        String prompt = "You are an expert Boba Barista AI named 'POB AI' for the premium bubble tea shop 'Pop O Bob'.\n" +
            "Your job is to recommend exactly ONE drink from our menu based on the user's craving.\n\n" +
            "### STORE KNOWLEDGE BASE ###\n" +
            "Our Menu:\n" + menuStr + "\n\n" +
            "### RULES ###\n" +
            "1. You MUST pick exactly one product ID from the menu list provided. Never invent a product.\n" +
            "2. If the user wants fruit/refreshing, recommend p4, p5, p6, or p7.\n" +
            "3. If the user wants sweet/chocolate/dessert, recommend p1, p2, p8, or p9.\n" +
            "4. If the user wants traditional/tea, recommend p3.\n" +
            "5. Keep your 'reason' short, playful, friendly, and tailored to Pop O Bob.\n\n" +
            "### EXAMPLES ###\n" +
            "Craving: 'I need something chocolatey and rich'\n" +
            "Output: {\"productId\": \"p2\", \"reason\": \"Our Ferrero Boba is incredibly rich and chocolatey, just what you need to satisfy that sweet tooth!\"}\n\n" +
            "Craving: 'Something light and floral'\n" +
            "Output: {\"productId\": \"p6\", \"reason\": \"Our Elderflower Iced Boba Tea is beautifully light and floral, perfect for a refreshing afternoon!\"}\n\n" +
            "### ACTUAL REQUEST ###\n" +
            "The user is craving: \"" + craving + "\"\n" +
            "Respond strictly in valid JSON format with no markdown formatting. The JSON must have exactly two keys: 'productId' and 'reason'.\n";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + geminiApiKey;

        try {
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);
            Map<String, Object> contents = new HashMap<>();
            contents.put("parts", new Object[]{parts});
            requestBody.put("contents", new Object[]{contents});

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String textResponse = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean up possible markdown code blocks
            textResponse = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            
            AiResponse aiResponse = objectMapper.readValue(textResponse, AiResponse.class);
            return aiResponse;
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to get recommendation from AI: " + e.getMessage());
        }
    }
}
