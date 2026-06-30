package com.lastsave.controller;

public class ResolveResponse {
    private String status;
    private String receipt;
    private String message;

    public ResolveResponse() {
    }

    public ResolveResponse(String status, String receipt, String message) {
        this.status = status;
        this.receipt = receipt;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public String getReceipt() {
        return receipt;
    }

    public String getMessage() {
        return message;
    }
}
