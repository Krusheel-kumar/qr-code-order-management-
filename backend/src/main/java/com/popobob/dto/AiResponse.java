package com.popobob.dto;

public class AiResponse {
    private String productId;
    private String reason;

    public AiResponse() {}

    public AiResponse(String productId, String reason) {
        this.productId = productId;
        this.reason = reason;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
