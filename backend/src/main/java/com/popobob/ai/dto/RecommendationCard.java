package com.popobob.ai.dto;

public class RecommendationCard {
    private String id;
    private String name;
    private String image;
    private double price;
    private String tag;
    private String reason;
    private String emoji;

    public RecommendationCard() {}

    public RecommendationCard(String id, String name, String image, double price, String tag, String reason, String emoji) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
        this.tag = tag;
        this.reason = reason;
        this.emoji = emoji;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
}
