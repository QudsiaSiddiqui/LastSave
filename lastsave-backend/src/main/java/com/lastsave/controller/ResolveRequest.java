package com.lastsave.controller;

public class ResolveRequest {
    private String taskDescription;
    private boolean forceFail;

    public ResolveRequest() {
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public boolean isForceFail() {
        return forceFail;
    }

    public void setForceFail(boolean forceFail) {
        this.forceFail = forceFail;
    }
}
