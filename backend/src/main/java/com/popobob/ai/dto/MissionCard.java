package com.popobob.ai.dto;

public class MissionCard {
    private String id;
    private String title;
    private String description;
    private String reward;
    private int progress;
    private int total;
    private String emoji;
    private boolean completed;

    public MissionCard() {}

    public MissionCard(String id, String title, String description, String reward, int progress, int total, String emoji, boolean completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.reward = reward;
        this.progress = progress;
        this.total = total;
        this.emoji = emoji;
        this.completed = completed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReward() { return reward; }
    public void setReward(String reward) { this.reward = reward; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
