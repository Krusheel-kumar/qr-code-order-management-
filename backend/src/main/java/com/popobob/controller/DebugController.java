package com.popobob.controller;

import com.popobob.model.User;
import com.popobob.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> {
            boolean isBcrypt = u.getPasswordHash() != null && u.getPasswordHash().startsWith("$2a$");
            return Map.<String, Object>of(
                "id", u.getId(),
                "email", u.getEmail() != null ? u.getEmail() : "null",
                "role", u.getRole() != null ? u.getRole() : "null",
                "isBcryptHashed", isBcrypt
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
            "configuredAdminEmailEnvVar", adminEmail,
            "databaseUsers", users
        ));
    }

    @PostMapping("/reset-admin")
    public ResponseEntity<?> resetAdminPassword() {
        if (adminEmail == null || adminEmail.isEmpty() || adminPassword == null || adminPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "ADMIN_EMAIL or ADMIN_PASSWORD env vars are missing"));
        }

        List<User> admins = userRepository.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .collect(Collectors.toList());

        if (admins.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No admin users found to reset"));
        }

        for (User admin : admins) {
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setEmail(adminEmail); // sync email with env var just in case
            userRepository.save(admin);
        }

        return ResponseEntity.ok(Map.of("message", "Admin password successfully reset and BCrypt hashed", "adminsUpdated", admins.size()));
    }
}
