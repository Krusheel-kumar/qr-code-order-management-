package com.popobob.ai.dto;

public class RewardCard {
    private String id;
    private String title;
    private String description;
    private int pointsRequired;
    private String type; // "DRINK", "DISCOUNT", "GIFT"
    private String emoji;
    private boolean unlocked;
    private String expiresAt;

    public RewardCard() {}

    public RewardCard(String id, String title, String description, int pointsRequired, String type, String emoji, boolean unlocked, String expiresAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.pointsRequired = pointsRequired;
        this.type = type;
        this.emoji = emoji;
        this.unlocked = unlocked;
        this.expiresAt = expiresAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPointsRequired() { return pointsRequired; }
    public void setPointsRequired(int pointsRequired) { this.pointsRequired = pointsRequired; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }
}
