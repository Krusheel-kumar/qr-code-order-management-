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
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.popobob.service.LoyaltyService loyaltyService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String phoneNumber = body.get("phoneNumber");

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        User user = new User();
        user.setUsername(name);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setPasswordHash(passwordEncoder.encode(password)); 
        user.setRole("USER");
        user.setLoyaltyPoints(0);

        userRepository.save(user);

        // Claim any pending guest rewards using the phone number
        loyaltyService.claimGuestRewards(user.getPhoneNumber(), user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(Map.of("user", user, "token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email") != null ? body.get("email").trim() : null;
        String password = body.get("password") != null ? body.get("password").trim() : null;

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                // Claim any pending guest rewards on login just in case
                loyaltyService.claimGuestRewards(user.getPhoneNumber(), user);

                String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
                return ResponseEntity.ok(Map.of("user", user, "token", token));
            }
        }
        
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}
