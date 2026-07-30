package com.popobob.dto;

import java.util.List;

public class AiResponse {
    private List<String> productIds;
    private String reason;

    public AiResponse() {}

    public AiResponse(List<String> productIds, String reason) {
        this.productIds = productIds;
        this.reason = reason;
    }

    public List<String> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<String> productIds) {
        this.productIds = productIds;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
