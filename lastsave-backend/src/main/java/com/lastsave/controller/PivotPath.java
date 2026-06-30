package com.lastsave.controller;

public class PivotPath {
    private String title;
    private String description;
    private String action;

    public PivotPath() {
    }

    public PivotPath(String title, String description, String action) {
        this.title = title;
        this.description = description;
        this.action = action;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getAction() {
        return action;
    }
}
