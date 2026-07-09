package com.popobob.ai.service;

import com.popobob.ai.dto.*;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * AIContextService — AI Engagement Layer (Read-Only)
 *
 * This service is COMPLETELY INDEPENDENT from OrderService, PaymentService,
 * TrackingService, CheckoutService, and Authentication.
 *
 * It returns mocked data for the demo. To integrate with real data in production,
 * replace the mock methods below with actual repository calls.
 * NEVER modify order, payment, or loyalty data from this service.
 */
@Service
public class AIContextService {

    /**
     * Returns the full AI context for the POP Buddy engagement layer.
     * Currently returns mocked data. Safe to call — no side effects.
     *
     * @param orderId       The current order ID (optional)
     * @param customerName  Customer name from the order (optional)
     * @param isGuest       Whether the customer is a guest user
     */
    public AIContextResponse getMockedContext(String orderId, String customerName, boolean isGuest) {
        AIContextResponse response = new AIContextResponse();

        // ── 1. Customer Info ───────────────────────────────────────
        String displayName = (customerName != null && !customerName.isBlank()) ? customerName : (isGuest ? "Guest" : "Friend");
        response.setCustomer(new AIContextResponse.CustomerInfo(
            displayName,
            isGuest,
            isGuest ? null : "Bronze Boba",
            buildGreeting(displayName, isGuest)
        ));

        // ── 2. Wallet / Loyalty ────────────────────────────────────
        if (!isGuest) {
            response.setWallet(new AIContextResponse.WalletInfo(
                420,         // points
                42.0,        // pointsValue (₹)
                500,         // nextTierPoints
                "Bronze Boba",
                "#CD7F32"
            ));
        } else {
            response.setWallet(new AIContextResponse.WalletInfo(
                0, 0.0, 100, "Guest", "#AAAAAA"
            ));
        }

        // ── 3. Order Info ──────────────────────────────────────────
        String orderNum = (orderId != null && !orderId.isBlank())
            ? "POB-" + orderId.substring(0, Math.min(4, orderId.length())).toUpperCase()
            : "POB-1025";
        response.setOrder(new AIContextResponse.OrderInfo(
            orderId != null ? orderId : "mock-order-id",
            orderNum,
            "PREPARING",
            220.0,
            "DINE_IN"
        ));

        // ── 4. Personalized Recommendations ───────────────────────
        response.setRecommendations(buildRecommendations());

        // ── 5. Trending Today ──────────────────────────────────────
        response.setTrending(buildTrending());

        // ── 6. Missions ────────────────────────────────────────────
        response.setMissions(buildMissions(isGuest));

        // ── 7. Rewards ─────────────────────────────────────────────
        response.setRewards(buildRewards(isGuest));

        // ── 8. Fun Fact ────────────────────────────────────────────
        response.setFunFact(new AIContextResponse.FunFact(
            "Bubble tea was invented in Taiwan in the 1980s. The 'bubbles' originally referred to the frothy top from shaking — not the tapioca pearls!",
            "🧋",
            "Bubble Tea History"
        ));

        return response;
    }

    // ── Private helpers ────────────────────────────────────────────

    private String buildGreeting(String name, boolean isGuest) {
        if (isGuest) return "Hey there! 👋";
        return "Hey " + name + "! 👋";
    }

    private List<RecommendationCard> buildRecommendations() {
        return Arrays.asList(
            new RecommendationCard(
                "taro-milk-tea",
                "Taro Milk Tea",
                "",
                189.0,
                "Most Popular",
                "Creamy, sweet, and perfectly purple — our #1 bestseller!",
                "🍠"
            ),
            new RecommendationCard(
                "mango-popping",
                "Mango Popping Boba",
                "",
                199.0,
                "Summer Special",
                "Tropical mango with exploding fruit pearls — sunshine in a cup!",
                "🥭"
            ),
            new RecommendationCard(
                "matcha-latte",
                "Matcha Brown Sugar Latte",
                "",
                219.0,
                "New Arrival",
                "Earthy premium matcha with caramel brown sugar swirls.",
                "🍵"
            ),
            new RecommendationCard(
                "honeydew-milk",
                "Honeydew Milk Tea",
                "",
                179.0,
                "Staff Pick",
                "Light, refreshing melon milk tea with a hint of sweetness.",
                "🍈"
            )
        );
    }

    private List<RecommendationCard> buildTrending() {
        return Arrays.asList(
            new RecommendationCard(
                "brown-sugar-boba",
                "Brown Sugar Tiger Milk",
                "",
                229.0,
                "🔥 Trending #1",
                "Instagram-famous tiger stripes with rich brown sugar caramel.",
                "🐯"
            ),
            new RecommendationCard(
                "strawberry-jasmine",
                "Strawberry Jasmine Tea",
                "",
                189.0,
                "🔥 Trending #2",
                "Floral jasmine tea with fresh strawberry popping pearls.",
                "🍓"
            ),
            new RecommendationCard(
                "coconut-jelly",
                "Coconut Jelly Milk Tea",
                "",
                209.0,
                "🔥 Trending #3",
                "Tropical coconut with silky smooth milk tea and coconut jelly.",
                "🥥"
            )
        );
    }

    private List<MissionCard> buildMissions(boolean isGuest) {
        if (isGuest) {
            return Arrays.asList(
                new MissionCard(
                    "mission-join",
                    "Join POP Club",
                    "Create a free account to unlock missions & rewards",
                    "🎁 Unlock All Rewards",
                    0, 1,
                    "🌟",
                    false
                )
            );
        }
        return Arrays.asList(
            new MissionCard(
                "mission-3orders",
                "Boba Adventurer",
                "Order 3 different drinks this week",
                "50 POP Points + Secret Drink",
                1, 3,
                "🧭",
                false
            ),
            new MissionCard(
                "mission-weekend",
                "Weekend Warrior",
                "Visit us on a weekend",
                "Double Points on next order",
                0, 1,
                "🎉",
                false
            ),
            new MissionCard(
                "mission-share",
                "Share the Love",
                "Refer a friend to Pop O Bob",
                "Free Drink for you + friend",
                0, 1,
                "❤️",
                false
            )
        );
    }

    private List<RewardCard> buildRewards(boolean isGuest) {
        return Arrays.asList(
            new RewardCard(
                "reward-free-drink",
                "Free Signature Drink",
                "Redeem any drink up to ₹220",
                500,
                "DRINK",
                "🧋",
                !isGuest,
                "2026-07-31"
            ),
            new RewardCard(
                "reward-birthday",
                "Birthday Special",
                "50% off on your birthday month",
                0,
                "DISCOUNT",
                "🎂",
                !isGuest,
                "2026-07-31"
            ),
            new RewardCard(
                "reward-secret",
                "Secret Menu Access",
                "Unlock our hidden off-menu creations",
                200,
                "GIFT",
                "🎁",
                !isGuest,
                "2026-07-31"
            )
        );
    }
}
