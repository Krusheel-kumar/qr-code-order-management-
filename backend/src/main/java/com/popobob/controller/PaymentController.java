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
            int amount = Integer.parseInt(data.get("amount").toString());
            
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Razorpay requires amount in paise (multiply by 100)
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Payment Order failed: " + e.getMessage()));
        }
    }
}
