package com.popobob.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.HashMap;

@Service
public class OtpService {

    @Value("${msg91.auth-key}")
    private String authKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verifyWidgetToken(String token) {
        try {
            String url = "https://control.msg91.com/api/v5/widget/verifyAccessToken";
            
            System.out.println("MSG91 Verify Token Request: " + url);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Content-Type", "application/json");

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("authkey", authKey);
            requestBody.put("access-token", token);

            org.springframework.http.HttpEntity<Map<String, String>> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("MSG91 Token Verify Response: " + response.getBody());

            if (response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.CREATED) {
                Map<String, Object> body = response.getBody();
                if (body != null && "error".equalsIgnoreCase((String) body.get("type"))) {
                    System.err.println("MSG91 token verify error: " + body);
                    return false;
                }
                return true;
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("MSG91 Verify HTTP Error: " + e.getResponseBodyAsString());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("MSG91 Verify Exception: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }
}
