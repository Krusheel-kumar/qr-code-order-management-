package com.popobob.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import com.popobob.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/menu/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/ai/context").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/admin/coupons").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v2/admin/stores/*/blacklist/**").permitAll()
                .requestMatchers("/api/auth/**", "/api/discovery/**", "/api/public/**", "/ws/**", "/api/loyalty/guest/**").permitAll()

                // --- Admin-only order endpoints (declared FIRST so they take priority) ---
                // These must be before the customer wildcard rules below
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/orders/active").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/orders/history").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/orders/*/status").hasRole("ADMIN")

                // --- Customer order endpoints (unauthenticated customers) ---
                // POST: place a new order (QR dine-in, pickup, delivery)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/orders").permitAll()
                // GET by ID: customer tracks their own order — only UUID-shaped paths reach here
                // because /active and /history are already handled above
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/orders/*").permitAll()
                // POST: customer initiates Razorpay payment for pickup orders
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/payments/create-order").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/v2/payments/callback").permitAll()
                // GET: customer fetches their own profile and order history
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/users/*").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/users/*/orders").permitAll()

                // All remaining requests require authentication
                .requestMatchers("/api/admin/**", "/api/v2/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/menu/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
