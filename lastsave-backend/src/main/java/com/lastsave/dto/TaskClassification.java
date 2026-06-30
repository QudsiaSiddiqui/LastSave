package com.lastsave.dto;

import java.util.List;

import lombok.Data;

@Data
public class TaskClassification {
    private String taskType;
    private double confidence;
    private String reasoning;
    private List<String> detectedSources;
    private String recommendedBehavior;
}