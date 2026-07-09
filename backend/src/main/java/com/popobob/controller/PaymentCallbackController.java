package com.popobob.controller;

import com.popobob.service.PaymentService;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v2/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentCallbackController {

    private final PaymentService paymentService;

    @Value("${razorpay.webhook-secret:local_webhook_secret_key}")
    private String webhookSecret;

    @PostMapping("/callback")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("x-razorpay-signature") String signature) {
        log.info("Received Razorpay Webhook Callback");
        try {
            // 1. Webhook Signature Verification
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            if (!isValid) {
                log.error("Signature verification failed: Invalid webhook signature.");
                return ResponseEntity.status(400).body(Map.of("message", "Invalid signature"));
            }

            // 2. Parse Webhook Event
            JSONObject json = new JSONObject(payload);
            String event = json.optString("event");
            log.info("Processing webhook event: {}", event);

            if ("order.paid".equals(event) || "payment.captured".equals(event)) {
                JSONObject payloadObj = json.getJSONObject("payload");
                String razorpayOrderId = null;
                BigDecimal paidAmount = BigDecimal.ZERO;
                String currency = "INR";

                if (payloadObj.has("order")) {
                    JSONObject orderEntity = payloadObj.getJSONObject("order").getJSONObject("entity");
                    razorpayOrderId = orderEntity.getString("id");
                    paidAmount = new BigDecimal(orderEntity.getLong("amount")).divide(new BigDecimal("100"));
                    currency = orderEntity.getString("currency");
                } else if (payloadObj.has("payment")) {
                    JSONObject paymentEntity = payloadObj.getJSONObject("payment").getJSONObject("entity");
                    razorpayOrderId = paymentEntity.optString("order_id", null);
                    paidAmount = new BigDecimal(paymentEntity.getLong("amount")).divide(new BigDecimal("100"));
                    currency = paymentEntity.getString("currency");
                }

                if (razorpayOrderId == null) {
                    log.warn("Webhook event ignored: No order ID found in payload");
                    return ResponseEntity.ok().build();
                }

                // 3. Confirm Payment Transactionally
                paymentService.verifyAndConfirmPayment(razorpayOrderId, paidAmount, currency);
            }

            return ResponseEntity.ok().build();
        } catch (com.razorpay.RazorpayException e) {
            log.error("Signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(400).body(Map.of("message", "Signature verification failed: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Webhook processing failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("message", "Processing error: " + e.getMessage()));
        }
    }
}
