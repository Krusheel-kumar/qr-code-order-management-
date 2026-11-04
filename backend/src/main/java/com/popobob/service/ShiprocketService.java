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

    // Film Nagar Outlet Coordinates
    public static final double PICKUP_LAT = 17.4152044;
    public static final double PICKUP_LNG = 78.4076438;
    public static final String PICKUP_PINCODE = "500096";

    private static final Map<String, double[]> HYD_COORDINATES = Map.ofEntries(
        Map.entry("500096", new double[]{17.4152, 78.4076}), // Film Nagar / Jubilee Hills
        Map.entry("500033", new double[]{17.4325, 78.4070}), // Jubilee Hills
        Map.entry("500034", new double[]{17.4168, 78.4382}), // Banjara Hills
        Map.entry("500081", new double[]{17.4435, 78.3772}), // Madhapur / Hitech City
        Map.entry("500032", new double[]{17.4401, 78.3489}), // Gachibowli
        Map.entry("500084", new double[]{17.4699, 78.3578}), // Kondapur
        Map.entry("500045", new double[]{17.4399, 78.4285}), // Yousufguda
        Map.entry("500082", new double[]{17.4256, 78.4528}), // Somajiguda / Panjagutta
        Map.entry("500016", new double[]{17.4447, 78.4664}), // Begumpet
        Map.entry("500018", new double[]{17.4563, 78.4439}), // Sanath Nagar / Erragadda
        Map.entry("500089", new double[]{17.3995, 78.3758}), // Manikonda
        Map.entry("500075", new double[]{17.3871, 78.3428}), // Gandipet / Narsingi
        Map.entry("500072", new double[]{17.4933, 78.3914})  // Kukatpally
    );

    public double[] resolveCoordinates(String pincode, Double lat, Double lng) {
        if (lat != null && lng != null && lat > 0 && lng > 0) {
            return new double[]{lat, lng};
        }
        if (pincode != null && HYD_COORDINATES.containsKey(pincode.trim())) {
            return HYD_COORDINATES.get(pincode.trim());
        }
        return new double[]{17.4200, 78.4100};
    }

    /**
     * Check on-demand hyperlocal delivery serviceability and rates using Shiprocket Quick.
     */
    public Map<String, Object> checkServiceability(String deliveryPincode, Double weight) {
        return checkServiceability(deliveryPincode, weight, null, null);
    }

    public Map<String, Object> checkServiceability(String deliveryPincode, Double weight, Double lat, Double lng) {
        double parcelWeight = (weight != null && weight > 0) ? weight : 0.5;
        double[] coords = resolveCoordinates(deliveryPincode, lat, lng);
        double destLat = coords[0];
        double destLng = coords[1];

        String token = getAuthToken();
        String url = baseUrl + "/courier/serviceability/?pickup_postcode=" + PICKUP_PINCODE +
                "&delivery_postcode=" + deliveryPincode +
                "&lat_from=" + PICKUP_LAT +
                "&long_from=" + PICKUP_LNG +
                "&lat_to=" + destLat +
                "&long_to=" + destLng +
                "&is_new_hyperlocal=1" +
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
                Object dataObj = body.get("data");

                if (dataObj instanceof List) {
                    List<Map<String, Object>> courierList = (List<Map<String, Object>>) dataObj;
                    if (!courierList.isEmpty()) {
                        Map<String, Object> quickCourier = courierList.get(0);
                        result.put("serviceable", true);
                        result.put("isHyperlocal", true);
                        result.put("courierName", "Shiprocket Quick (Instant Bike Delivery)");
                        result.put("recommendedCourier", quickCourier);
                        result.put("estimatedDeliveryFee", quickCourier.get("rates"));
                        result.put("distanceKm", quickCourier.get("distance"));
                        result.put("estimatedTime", "30-45 mins (Direct Bike Rider)");
                        result.put("etdHours", quickCourier.get("etd_hours"));
                        result.put("couriers", courierList);
                        return result;
                    }
                } else if (dataObj instanceof Map) {
                    Map<String, Object> data = (Map<String, Object>) dataObj;
                    List<Map<String, Object>> couriers = (List<Map<String, Object>>) data.get("available_courier_companies");
                    boolean isServiceable = couriers != null && !couriers.isEmpty();
                    result.put("serviceable", isServiceable);
                    result.put("isHyperlocal", false);
                    if (isServiceable) {
                        Map<String, Object> bestCourier = couriers.get(0);
                        result.put("recommendedCourier", bestCourier);
                        result.put("estimatedDeliveryFee", bestCourier.get("rate"));
                        result.put("estimatedTime", "Same-Day / Next-Day Delivery");
                    }
                    return result;
                }
            }
        } catch (HttpClientErrorException e) {
            log.warn("Shiprocket serviceability check failed for pincode {}: {}", deliveryPincode, e.getResponseBodyAsString());
            result.put("serviceable", false);
            result.put("error", "Location currently not serviceable for instant delivery: " + deliveryPincode);
            return result;
        } catch (Exception e) {
            log.error("Shiprocket serviceability check error: {}", e.getMessage(), e);
            result.put("serviceable", false);
            result.put("error", e.getMessage());
            return result;
        }

        result.put("serviceable", false);
        result.put("error", "No instant bike rider available for this location.");
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

        // Hyperlocal Food Delivery parameters
        double[] coords = resolveCoordinates(order.getDeliveryPincode(), null, null);
        payload.put("is_hyperlocal", 1);
        payload.put("lat", String.valueOf(coords[0]));
        payload.put("long", String.valueOf(coords[1]));

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
