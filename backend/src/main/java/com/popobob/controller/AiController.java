package com.popobob.controller;

import com.popobob.dto.AiRequest;
import com.popobob.dto.AiResponse;
import com.popobob.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")

public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> recommendDrink(@RequestBody AiRequest request) {
        try {
            if (request.getCraving() == null || request.getCraving().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Craving cannot be empty");
            }
            AiResponse response = aiService.recommendDrink(request.getCraving());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage() + "\n" + sw.toString());
        }
    }
}
