package com.lastsave.dto;

import lombok.Data;

@Data
public class ReasoningStep {
    private String step;
    private String message;
    
    public ReasoningStep() {}
    
    public ReasoningStep(String step, String message) {
        this.step = step;
        this.message = message;
    }
}