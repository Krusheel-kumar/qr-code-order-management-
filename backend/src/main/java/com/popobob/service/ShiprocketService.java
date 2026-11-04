package com.popobob.service;

import com.popobob.model.Order;
import com.popobob.model.OrderItem;
import com.popobob.repository.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
public class ShiprocketService {

    @Value("${shiprocket.email:krusheel@gmail.com}")
    private String email;

    @Value("${shiprocket.password:qexAiN!3LrIc0$3SOVBSHWuKEyKmQTkD}")
    private String password;

    @Value("${shiprocket.base-url:https://apiv2.shiprocket.in/v1/external}")
    private String baseUrl;

    @Value("${shiprocket.pickup-location:Home}")
    private String defaultPickupLocation;

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private String cachedToken = null;
    private long tokenExpiryTime = 0;

    public ShiprocketService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Authenticates with Shiprocket and caches the Bearer token in-memory.
     * Shiprocket tokens are typically valid for 10 days. We refresh after 9 days.
     */
    public synchronized String getAuthToken() {
        if (cachedToken != null && System.currentTimeMillis() < tokenExpiryTime) {
            return cachedToken;
        }

        try {
            String loginUrl = baseUrl + "/auth/login";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> credentials = new HashMap<>();
            credentials.put("email", email);
            credentials.put("password", password);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(credentials, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(loginUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                cachedToken = (String) response.getBody().get("token");
                // Cache for 9 days in milliseconds
                tokenExpiryTime = System.currentTimeMillis() + (9L * 24 * 60 * 60 * 1000);
                log.info("Shiprocket authentication successful. Token acquired.");
                return cachedToken;
            }
        } catch (HttpClientErrorException e) {
            log.error("Shiprocket Login Failed with status {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Shiprocket authentication failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Shiprocket Login Exception: {}", e.getMessage(), e);
            throw new RuntimeException("Shiprocket authentication error: " + e.getMessage());
        }

        throw new RuntimeException("Unable to acquire Shiprocket authentication token.");
    }

    /**
     * Check delivery serviceability and rates from outlet pincode (500096) to customer pincode.
     */
    public Map<String, Object> checkServiceability(String deliveryPincode, Double weight) {
        double parcelWeight = (weight != null && weight > 0) ? weight : 0.5;
        String pickupPincode = "500096"; // Film Nagar Outlet default

        String token = getAuthToken();
        String url = baseUrl + "/courier/serviceability/?pickup_postcode=" + pickupPincode +
                "&delivery_postcode=" + deliveryPincode +
                "&weight=" + parcelWeight +
                "&cod=0";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        Map<String, Object> result = new HashMap<>();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Map<String, Object> data = (Map<String, Object>) body.get("data");

                if (data != null) {
                    List<Map<String, Object>> couriers = (List<Map<String, Object>>) data.get("available_courier_companies");
                    boolean isServiceable = couriers != null && !couriers.isEmpty();

                    result.put("serviceable", isServiceable);
                    result.put("courierCount", couriers != null ? couriers.size() : 0);
                    result.put("couriers", couriers);

                    if (isServiceable) {
                        // Find lowest rate courier as recommended
                        Map<String, Object> bestCourier = couriers.stream()
                                .min(Comparator.comparingDouble(c -> {
                                    Object r = c.get("rate");
                                    return r instanceof Number ? ((Number) r).doubleValue() : 999.0;
                                })).orElse(couriers.get(0));

                        result.put("recommendedCourier", bestCourier);
                        result.put("estimatedDeliveryFee", bestCourier.get("rate"));
                        result.put("estimatedTime", bestCourier.get("etd"));
                    }
                    return result;
                }
            }
        } catch (HttpClientErrorException e) {
            log.warn("Shiprocket serviceability check failed for pincode {}: {}", deliveryPincode, e.getResponseBodyAsString());
            result.put("serviceable", false);
            result.put("error", "Pincode currently not serviceable or invalid: " + deliveryPincode);
            return result;
        } catch (Exception e) {
            log.error("Shiprocket serviceability check error: {}", e.getMessage(), e);
            result.put("serviceable", false);
            result.put("error", e.getMessage());
            return result;
        }

        result.put("serviceable", false);
        return result;
    }

    /**
     * Create an order in Shiprocket for delivery fulfillment.
     */
    public Map<String, Object> createShipment(Order order) {
        String token = getAuthToken();
        String url = baseUrl + "/orders/create/adhoc";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> payload = new HashMap<>();
        payload.put("order_id", order.getOrderNumber() != null ? order.getOrderNumber() : order.getId().toString());
        payload.put("order_date", order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        payload.put("pickup_location", defaultPickupLocation);
        payload.put("comment", "Pop O' Bob Specialty Bubble Tea - Handle with care");

        // Customer details
        String customerName = order.getCustomerName() != null && !order.getCustomerName().trim().isEmpty() 
                ? order.getCustomerName() : "Pop O Bob Guest";
        payload.put("billing_customer_name", customerName);
        payload.put("billing_last_name", "");
        payload.put("billing_address", order.getDeliveryAddress() != null ? order.getDeliveryAddress() : "Jubilee Hills");
        payload.put("billing_city", order.getDeliveryCity() != null ? order.getDeliveryCity() : "Hyderabad");
        payload.put("billing_pincode", order.getDeliveryPincode() != null ? order.getDeliveryPincode() : "500096");
        payload.put("billing_state", "Telangana");
        payload.put("billing_country", "India");
        payload.put("billing_phone", order.getCustomerPhone() != null ? order.getCustomerPhone() : "7794971935");
        payload.put("shipping_is_billing", true);

        // Order items
        List<Map<String, Object>> itemsList = new ArrayList<>();
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (OrderItem item : order.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("name", item.getProductName() != null ? item.getProductName() : "Specialty Boba");
                itemMap.put("sku", item.getProductId() != null ? item.getProductId().toString() : "BOBA-ITEM");
                int units = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;
                double sellingPrice = item.getSubtotal() != null ? (item.getSubtotal().doubleValue() / units) : 150.0;
                itemMap.put("units", units);
                itemMap.put("selling_price", sellingPrice);
                itemsList.add(itemMap);
            }
        } else {
            Map<String, Object> defaultItem = new HashMap<>();
            defaultItem.put("name", "Specialty Bubble Tea");
            defaultItem.put("sku", "BOBA-CUP");
            defaultItem.put("units", 1);
            defaultItem.put("selling_price", order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 180.0);
            itemsList.add(defaultItem);
        }
        payload.put("order_items", itemsList);

        payload.put("payment_method", "PAID".equalsIgnoreCase(order.getPaymentStatus()) ? "Prepaid" : "COD");
        payload.put("sub_total", order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 180.0);
        payload.put("length", 10);
        payload.put("breadth", 10);
        payload.put("height", 14);
        payload.put("weight", 0.5);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Object orderIdObj = body.get("order_id");
                Object shipmentIdObj = body.get("shipment_id");

                if (orderIdObj != null) {
                    order.setShiprocketOrderId(((Number) orderIdObj).longValue());
                }
                if (shipmentIdObj != null) {
                    order.setShiprocketShipmentId(((Number) shipmentIdObj).longValue());
                }
                order.setDeliveryStatus("SHIPMENT_CREATED");
                orderRepository.save(order);

                log.info("Shiprocket order created. OrderId: {}, ShipmentId: {}", orderIdObj, shipmentIdObj);
                return body;
            }
        } catch (HttpClientErrorException e) {
            log.error("Shiprocket Create Order Failed: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Shiprocket order creation failed: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Shiprocket Create Order Error: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create Shiprocket order: " + e.getMessage());
        }

        throw new RuntimeException("Unexpected response from Shiprocket while creating order.");
    }

    /**
     * Assign courier / AWB and schedule pickup for shipment.
     */
    public Map<String, Object> assignCourierAndSchedulePickup(Long shipmentId, Long courierId) {
        String token = getAuthToken();
        Map<String, Object> result = new HashMap<>();

        // 1. Assign AWB
        try {
            String awbUrl = baseUrl + "/courier/assign/awb";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(token);

            Map<String, Object> awbPayload = new HashMap<>();
            awbPayload.put("shipment_id", shipmentId);
            if (courierId != null) {
                awbPayload.put("courier_id", courierId);
            }

            HttpEntity<Map<String, Object>> awbReq = new HttpEntity<>(awbPayload, headers);
            ResponseEntity<Map> awbResp = restTemplate.postForEntity(awbUrl, awbReq, Map.class);

            if (awbResp.getStatusCode().is2xxSuccessful() && awbResp.getBody() != null) {
                result.put("awbDetails", awbResp.getBody());
            }

            // 2. Schedule Pickup
            String pickupUrl = baseUrl + "/courier/generate/pickup";
            Map<String, Object> pickupPayload = new HashMap<>();
            pickupPayload.put("shipment_id", Collections.singletonList(shipmentId));

            HttpEntity<Map<String, Object>> pickupReq = new HttpEntity<>(pickupPayload, headers);
            ResponseEntity<Map> pickupResp = restTemplate.postForEntity(pickupUrl, pickupReq, Map.class);

            if (pickupResp.getStatusCode().is2xxSuccessful() && pickupResp.getBody() != null) {
                result.put("pickupDetails", pickupResp.getBody());
            }

            return result;
        } catch (Exception e) {
            log.error("Error assigning courier / generating pickup for shipment {}: {}", shipmentId, e.getMessage(), e);
            result.put("error", e.getMessage());
            return result;
        }
    }

    /**
     * Track an active shipment by AWB code or shipment ID.
     */
    public Map<String, Object> trackShipment(String awbOrShipmentId) {
        String token = getAuthToken();
        String url = baseUrl + "/courier/track/awb/" + awbOrShipmentId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("Tracking failed for AWB {}: {}", awbOrShipmentId, e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("status", "IN_TRANSIT");
        fallback.put("message", "Live tracking update in progress.");
        return fallback;
    }
}
