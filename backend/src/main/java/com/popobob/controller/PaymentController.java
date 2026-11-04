package com.popobob.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double parsedAmount = Double.parseDouble(data.get("amount").toString());
            int amount = (int) Math.round(parsedAmount);

            // Local development sandbox fallback
            if (keyId == null || keyId.contains("placeholder") || keyId.startsWith("rzp_test_placeholder")) {
                Map<String, Object> mockResponse = Map.of(
                    "id", "order_mock_" + System.currentTimeMillis(),
                    "amount", amount * 100,
                    "currency", "INR"
                );
                return ResponseEntity.ok(mockResponse);
            }
            
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Razorpay requires amount in paise (multiply by 100)
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);

            Map<String, Object> responseMap = Map.of(
                "id", order.get("id").toString(),
                "amount", Integer.parseInt(order.get("amount").toString()),
                "currency", order.get("currency").toString()
            );

            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Payment Order failed: " + e.getMessage()));
        }
    }
}
