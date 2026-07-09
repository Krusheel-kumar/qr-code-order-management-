package com.popobob.ai.dto;

import java.util.List;

public class AIContextResponse {

    private CustomerInfo customer;
    private WalletInfo wallet;
    private OrderInfo order;
    private List<RecommendationCard> recommendations;
    private List<MissionCard> missions;
    private List<RewardCard> rewards;
    private List<RecommendationCard> trending;
    private FunFact funFact;

    public AIContextResponse() {}

    // ── Inner classes ──────────────────────────────────────────────

    public static class CustomerInfo {
        private String name;
        private boolean guest;
        private String loyaltyTier;
        private String greeting;

        public CustomerInfo() {}
        public CustomerInfo(String name, boolean guest, String loyaltyTier, String greeting) {
            this.name = name;
            this.guest = guest;
            this.loyaltyTier = loyaltyTier;
            this.greeting = greeting;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public boolean isGuest() { return guest; }
        public void setGuest(boolean guest) { this.guest = guest; }
        public String getLoyaltyTier() { return loyaltyTier; }
        public void setLoyaltyTier(String loyaltyTier) { this.loyaltyTier = loyaltyTier; }
        public String getGreeting() { return greeting; }
        public void setGreeting(String greeting) { this.greeting = greeting; }
    }

    public static class WalletInfo {
        private int points;
        private double pointsValue;
        private int nextTierPoints;
        private String tier;
        private String tierColor;

        public WalletInfo() {}
        public WalletInfo(int points, double pointsValue, int nextTierPoints, String tier, String tierColor) {
            this.points = points;
            this.pointsValue = pointsValue;
            this.nextTierPoints = nextTierPoints;
            this.tier = tier;
            this.tierColor = tierColor;
        }

        public int getPoints() { return points; }
        public void setPoints(int points) { this.points = points; }
        public double getPointsValue() { return pointsValue; }
        public void setPointsValue(double pointsValue) { this.pointsValue = pointsValue; }
        public int getNextTierPoints() { return nextTierPoints; }
        public void setNextTierPoints(int nextTierPoints) { this.nextTierPoints = nextTierPoints; }
        public String getTier() { return tier; }
        public void setTier(String tier) { this.tier = tier; }
        public String getTierColor() { return tierColor; }
        public void setTierColor(String tierColor) { this.tierColor = tierColor; }
    }

    public static class OrderInfo {
        private String id;
        private String orderNumber;
        private String status;
        private double total;
        private String orderType;

        public OrderInfo() {}
        public OrderInfo(String id, String orderNumber, String status, double total, String orderType) {
            this.id = id;
            this.orderNumber = orderNumber;
            this.status = status;
            this.total = total;
            this.orderType = orderType;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public double getTotal() { return total; }
        public void setTotal(double total) { this.total = total; }
        public String getOrderType() { return orderType; }
        public void setOrderType(String orderType) { this.orderType = orderType; }
    }

    public static class FunFact {
        private String text;
        private String emoji;
        private String source;

        public FunFact() {}
        public FunFact(String text, String emoji, String source) {
            this.text = text;
            this.emoji = emoji;
            this.source = source;
        }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getEmoji() { return emoji; }
        public void setEmoji(String emoji) { this.emoji = emoji; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
    }

    // ── Root-level getters/setters ─────────────────────────────────

    public CustomerInfo getCustomer() { return customer; }
    public void setCustomer(CustomerInfo customer) { this.customer = customer; }

    public WalletInfo getWallet() { return wallet; }
    public void setWallet(WalletInfo wallet) { this.wallet = wallet; }

    public OrderInfo getOrder() { return order; }
    public void setOrder(OrderInfo order) { this.order = order; }

    public List<RecommendationCard> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendationCard> recommendations) { this.recommendations = recommendations; }

    public List<MissionCard> getMissions() { return missions; }
    public void setMissions(List<MissionCard> missions) { this.missions = missions; }

    public List<RewardCard> getRewards() { return rewards; }
    public void setRewards(List<RewardCard> rewards) { this.rewards = rewards; }

    public List<RecommendationCard> getTrending() { return trending; }
    public void setTrending(List<RecommendationCard> trending) { this.trending = trending; }

    public FunFact getFunFact() { return funFact; }
    public void setFunFact(FunFact funFact) { this.funFact = funFact; }
}
