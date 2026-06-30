package com.lastsave.dto;

import lombok.Data;

@Data
public class ForgeResponse {
    private String draft;
    private double confidenceScore;
    private String taskType;
    
    public ForgeResponse() {}
    
    public ForgeResponse(String draft, double confidenceScore, String taskType) {
        this.draft = draft;
        this.confidenceScore = confidenceScore;
        this.taskType = taskType;
    }
}