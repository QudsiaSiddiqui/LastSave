package com.lastsave.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/phoenix")
@CrossOrigin(origins = "http://localhost:5173")
public class PhoenixController {

    @PostMapping("/recover")
    public ResponseEntity<PhoenixResponse> recover(@RequestBody PhoenixRequest request) {
        String taskType = request.getTaskType() == null ? "UNKNOWN" : request.getTaskType();

        List<PivotPath> paths = switch (taskType.toUpperCase()) {
            case "HIRE" -> List.of(
                new PivotPath("Direct Email", "Email hiring manager directly with formatted cover letter", "mailto:hiring@company.com"),
                new PivotPath("LinkedIn Apply", "Apply via LinkedIn Easy Apply with condensed version", "https://linkedin.com/jobs"),
                new PivotPath("Save for Later", "Save to portfolio for similar roles next week", "#portfolio")
            );
            case "CODE" -> List.of(
                new PivotPath("GitHub Submission", "Push to GitHub and share repository link", "https://github.com/new"),
                new PivotPath("Email Instructor", "Send ZIP file directly to instructor", "mailto:instructor@university.edu"),
                new PivotPath("Request Extension", "Canvas messaging for deadline extension", "#canvas")
            );
            default -> List.of(
                new PivotPath("Alternative Method", "Try alternative submission method", "#"),
                new PivotPath("Save Locally", "Download and save your work", "#download"),
                new PivotPath("Contact Support", "Reach out to support team", "mailto:support@example.com")
            );
        };

        return ResponseEntity.ok(new PhoenixResponse(paths));
    }
}
