package com.lastsave.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resolve")
@CrossOrigin(origins = "http://localhost:5173")
public class ResolveController {

    @PostMapping
    public ResponseEntity<ResolveResponse> resolve(@RequestBody ResolveRequest request) {
        boolean success = request.isForceFail() ? false : Math.random() > 0.3;

        if (success) {
            return ResponseEntity.ok(
                new ResolveResponse("SUCCESS", "mock-receipt-123", "Submitted successfully")
            );
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ResolveResponse("FAILED", null, "Server error - triggering SAFE mode"));
    }
}
