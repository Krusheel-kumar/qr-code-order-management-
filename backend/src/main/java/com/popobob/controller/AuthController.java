package com.popobob.controller;

import com.popobob.model.User;
import com.popobob.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.popobob.security.JwtUtil jwtUtil;

    @Autowired
    private com.popobob.service.LoyaltyService loyaltyService;

    @Autowired
    private com.popobob.service.OtpService otpService;

    @PostMapping("/verify-widget-token")
    public ResponseEntity<?> verifyWidgetToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String phoneNumber = body.get("phoneNumber");

        if (token == null || phoneNumber == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token and phone number are required"));
        }

        boolean isValid = otpService.verifyWidgetToken(token);
        if (!isValid) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired MSG91 Token"));
        }

        Optional<User> userOpt = userRepository.findFirstByPhoneNumber(phoneNumber);
        User user;

        boolean isNewUser = false;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            // New User Registration
            isNewUser = true;
            user = new User();
            user.setPhoneNumber(phoneNumber);
            // Default username if missing
            String name = body.get("name");
            user.setUsername(name != null && !name.trim().isEmpty() ? name : "Guest User");
            user.setRole("USER");
            user.setLoyaltyPoints(0);
            userRepository.save(user);
        }

        // Claim pending guest rewards using phone number
        loyaltyService.claimGuestRewards(user.getPhoneNumber(), user);

        // We use phone number as the username in the JWT token
        String jwtToken = jwtUtil.generateToken(user.getPhoneNumber(), user.getRole());
        return ResponseEntity.ok(Map.of("user", user, "token", jwtToken, "isNewUser", isNewUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        // Hardcoded admin credentials for local development
        if ("admin@popobob.com".equalsIgnoreCase(email)) {
            User adminUser = new User();
            adminUser.setEmail(email);
            adminUser.setUsername("Super Admin");
            adminUser.setRole("ADMIN");
            
            // Generate token with email as subject and ADMIN role
            String jwtToken = jwtUtil.generateToken(email, "ADMIN");
            
            return ResponseEntity.ok(Map.of(
                "user", adminUser,
                "token", jwtToken
            ));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
}
