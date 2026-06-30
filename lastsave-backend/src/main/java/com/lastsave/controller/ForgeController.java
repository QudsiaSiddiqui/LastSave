package com.lastsave.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lastsave.service.GeminiService;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/forge")
@CrossOrigin(origins = "http://localhost:5173")
public class ForgeController {

    private final GeminiService geminiService;

    public ForgeController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamForge(@RequestParam String taskDescription) {
        return geminiService.streamReasoning(taskDescription);
    }
}