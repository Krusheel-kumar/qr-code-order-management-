package com.popobob.controller;

import com.popobob.dto.AiRequest;
import com.popobob.dto.AiResponse;
import com.popobob.service.AiService;
import com.popobob.ai.dto.AIContextResponse;
import com.popobob.ai.service.AIContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")

public class AiController {

    private final AiService aiService;
    private final AIContextService aiContextService;

    public AiController(AiService aiService, AIContextService aiContextService) {
        this.aiService = aiService;
        this.aiContextService = aiContextService;
    }

    /**
     * GET /api/ai/context
     * AI Engagement Layer — returns mocked context for POP Buddy.
     * This endpoint is INDEPENDENT from all order/payment/tracking endpoints.
     * If this endpoint fails, the frontend gracefully degrades — tracking continues normally.
     */
    @GetMapping("/context")
    public ResponseEntity<AIContextResponse> getAIContext(
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false, defaultValue = "false") boolean guest) {
        try {
            AIContextResponse context = aiContextService.getMockedContext(orderId, customerName, guest);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            // Return 503 so the frontend can silently fall back to mocked data
            return ResponseEntity.status(503).build();
        }
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
