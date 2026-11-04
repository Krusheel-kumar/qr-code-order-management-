package com.popobob.controller;

import com.popobob.model.Order;
import com.popobob.repository.OrderRepository;
import com.popobob.service.ShiprocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final ShiprocketService shiprocketService;
    private final OrderRepository orderRepository;

    /**
     * Public endpoint to check if delivery is available to customer's pincode
     * and retrieve the real-time shipping rate and ETA.
     */
    @GetMapping("/serviceability")
    public ResponseEntity<Map<String, Object>> checkServiceability(
            @RequestParam String pincode,
            @RequestParam(required = false, defaultValue = "0.5") Double weight,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {
        
        Map<String, Object> serviceability = shiprocketService.checkServiceability(pincode, weight, lat, lng);
        return ResponseEntity.ok(serviceability);
    }

    /**
     * Dispatch an existing order to Shiprocket for courier/rider assignment.
     */
    @PostMapping("/orders/{orderId}/dispatch")
    public ResponseEntity<?> dispatchOrder(@PathVariable UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        try {
            Map<String, Object> shipmentResult = shiprocketService.createShipment(order);
            Long shipmentId = order.getShiprocketShipmentId();

            if (shipmentId != null) {
                // Automatically assign fastest courier and schedule pickup
                shiprocketService.assignCourierAndSchedulePickup(shipmentId, null);
            }

            return ResponseEntity.ok(shipmentResult);
        } catch (Exception e) {
            log.error("Failed to dispatch order {} to Shiprocket: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Live tracking for a delivery order.
     */
    @GetMapping("/track/{identifier}")
    public ResponseEntity<?> trackDelivery(@PathVariable String identifier) {
        // Identifier can be orderNumber, AWB, or order UUID
        try {
            if (identifier.startsWith("POB-")) {
                Order order = orderRepository.findByOrderNumber(identifier).orElse(null);
                if (order != null && order.getShiprocketAwb() != null) {
                    return ResponseEntity.ok(shiprocketService.trackShipment(order.getShiprocketAwb()));
                }
            }
            return ResponseEntity.ok(shiprocketService.trackShipment(identifier));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "status", "DISPATCHED",
                    "message", "Order is packed and awaiting courier pickup."
            ));
        }
    }
}
