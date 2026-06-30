package com.lastsave.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lastsave.config.GeminiConfig;
import com.lastsave.dto.ForgeResponse;
import com.lastsave.dto.ReasoningStep;
import com.lastsave.dto.TaskClassification;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class GeminiService {

    private final GeminiConfig geminiConfig;
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(GeminiConfig geminiConfig) {
        this.geminiConfig = geminiConfig;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    public Flux<String> streamReasoning(String taskDescription) {
        return Flux.create(sink -> {
            // Send raw JSON, EventSource adds "data: " prefix automatically
            sink.next(toJson(new ReasoningStep("classifying", "Analyzing your task type...")) + "\n");

            classifyTask(taskDescription)
                .flatMap(classification -> {
                    System.out.println("Classification result: " + classification.getTaskType() + " (confidence: " + classification.getConfidence() + ")");
                    sink.next(toJson(new ReasoningStep("analyzing", "Task identified: " + classification.getTaskType() + ". Gathering requirements...")) + "\n");
                    return generateDraft(taskDescription, classification)
                        .map(draft -> new Object[] { classification, draft });
                })
                .subscribe(result -> {
                    TaskClassification classification = (TaskClassification) result[0];
                    String draft = (String) result[1];

                    sink.next(toJson(new ReasoningStep("synthesizing", "Crafting your personalized draft...")) + "\n");
                    sink.next(toJson(new ForgeResponse(draft, classification.getConfidence(), classification.getTaskType())) + "\n");
                    sink.complete();
                }, error -> {
                    System.err.println("ERROR in stream: " + error.getMessage());
                    error.printStackTrace();
                    sink.next(toJson(new ReasoningStep("error", "Using fallback generation: " + error.getMessage())) + "\n");
                    sink.next(toJson(new ForgeResponse(generateFallbackDraft(taskDescription), 0.6, "FALLBACK")) + "\n");
                    sink.complete();
                });
        });
    }

    private Mono<TaskClassification> classifyTask(String taskDescription) {
        String prompt = "Classify this task into one of HIRE, CODE, DECK, THESIS, EMAIL, or UNKNOWN. "
                + "Return only a JSON object with fields: taskType, confidence, reasoning, detectedSources, recommendedBehavior. "
                + "Task description: \"" + taskDescription + "\".";

        return callGemini(prompt)
            .doOnNext(response -> System.out.println("RAW CLASSIFY RESPONSE: " + response.substring(0, Math.min(500, response.length()))))
            .map(this::parseClassification);
    }

    private Mono<String> generateDraft(String taskDescription, TaskClassification classification) {
        String prompt = buildDraftPrompt(taskDescription, classification);
        return callGemini(prompt)
            .doOnNext(response -> System.out.println("RAW DRAFT RESPONSE: " + response.substring(0, Math.min(500, response.length()))))
            .map(this::extractText);
    }

    private String buildDraftPrompt(String task, TaskClassification classification) {
        String type = classification.getTaskType();
        return switch (type) {
            case "HIRE" -> "Write a professional cover letter for this job application. Return ONLY the cover letter text. Task: " + task;
            case "CODE" -> "Write a README.md for this coding project. Return ONLY the README content. Task: " + task;
            case "DECK" -> "Write a presentation outline with speaker notes. Return ONLY the outline. Task: " + task;
            case "THESIS" -> "Write an abstract for this research paper. Return ONLY the abstract. Task: " + task;
            case "EMAIL" -> "Write a professional email. Return ONLY the email text. Task: " + task;
            default -> "Help with this task. Return ONLY your response. Task: " + task;
        };
    }

    private Mono<String> callGemini(String prompt) {
        String apiKey = geminiConfig.getApi().getKey();
        System.out.println("Using API key (first 10 chars): " + apiKey.substring(0, Math.min(10, apiKey.length())) + "...");

        String url = "/models/gemini-2.0-flash:generateContent?key=" + apiKey;
        String escapedPrompt = prompt.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");

        String body = """
            {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": "%s"
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048
                }
            }
            """.formatted(escapedPrompt);

        System.out.println("REQUEST BODY (first 200 chars): " + body.substring(0, Math.min(200, body.length())));

        return webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .onStatus(
                    status -> status.isError(),
                    response -> response.bodyToMono(String.class).map(errorBody -> {
                        System.err.println("API ERROR BODY: " + errorBody);
                        return new RuntimeException("Gemini API error: " + errorBody);
                    })
                )
                .bodyToMono(String.class)
                .onErrorResume(e -> {
                    System.err.println("WEBCLIENT ERROR: " + e.getMessage());
                    return Mono.just("{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"ERROR: " + e.getMessage().replace("\"", "\\\"") + "\"}]}}]}");
                });
    }

    private TaskClassification parseClassification(String response) {
        try {
            System.out.println("Parsing classification from: " + response.substring(0, Math.min(300, response.length())));
            String text = safeExtractText(response);
            text = cleanupJsonText(text);
            TaskClassification classification = safeReadValue(text, TaskClassification.class);

            if (classification == null) {
                classification = createFallback("safeReadValue returned null");
            }

            if (classification.getTaskType() == null || classification.getTaskType().isBlank()) {
                classification.setTaskType(inferTaskType(text));
            }

            return classification;
        } catch (Exception e) {
            System.err.println("Parse error: " + e.getMessage());
            TaskClassification fallback = createFallback(e.getMessage());
            fallback.setTaskType(inferTaskType(response));
            return fallback;
        }
    }

    private String extractText(String response) {
        try {
            return safeExtractText(response);
        } catch (Exception e) {
            System.err.println("Extract error: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }

    private String safeExtractText(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);

            if (root.has("candidates") && root.get("candidates").isArray() && root.get("candidates").size() > 0) {
                JsonNode candidate = root.get("candidates").get(0);

                if (candidate.has("content")) {
                    JsonNode content = candidate.get("content");
                    if (content.has("parts") && content.get("parts").isArray() && content.get("parts").size() > 0) {
                        return content.get("parts").get(0).path("text").asText();
                    }
                }

                if (candidate.has("output")) {
                    return candidate.get("output").asText();
                }

                if (candidate.has("message")) {
                    JsonNode message = candidate.get("message");
                    if (message.has("content") && message.get("content").isArray() && message.get("content").size() > 0) {
                        return message.get("content").get(0).path("text").asText();
                    }
                }
            }

            if (root.has("output")) {
                return root.get("output").asText();
            }

            if (root.has("text")) {
                return root.get("text").asText();
            }

            return response;
        } catch (Exception e) {
            System.err.println("safeExtractText error: " + e.getMessage());
            return response;
        }
    }

    private <T> T safeReadValue(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            System.err.println("safeReadValue error: " + e.getMessage());
            return null;
        }
    }

    private String cleanupJsonText(String text) {
        String cleaned = text.replaceAll("(?s)```json.*?```", "").replace("```", "").trim();
        int startIndex = cleaned.indexOf('{');
        int endIndex = cleaned.lastIndexOf('}');
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            cleaned = cleaned.substring(startIndex, endIndex + 1);
        }
        return cleaned;
    }

    private String inferTaskType(String text) {
        String normalized = text.toUpperCase(Locale.ROOT);
        if (normalized.contains("HIRE") || normalized.contains("COVER LETTER") || normalized.contains("JOB") || normalized.contains("APPLICATION")) {
            return "HIRE";
        }
        if (normalized.contains("CODE") || normalized.contains("README") || normalized.contains("PROJECT") || normalized.contains("GITHUB") || normalized.contains("BUG")) {
            return "CODE";
        }
        if (normalized.contains("DECK") || normalized.contains("PRESENTATION") || normalized.contains("SLIDES")) {
            return "DECK";
        }
        if (normalized.contains("THESIS") || normalized.contains("PAPER") || normalized.contains("RESEARCH") || normalized.contains("ABSTRACT")) {
            return "THESIS";
        }
        if (normalized.contains("EMAIL") || normalized.contains("MAIL") || normalized.contains("INBOX") || normalized.contains("PROFESSOR")) {
            return "EMAIL";
        }
        return "UNKNOWN";
    }

    private TaskClassification createFallback(String reason) {
        TaskClassification fallback = new TaskClassification();
        fallback.setTaskType("UNKNOWN");
        fallback.setConfidence(0.5);
        fallback.setReasoning("Fallback: " + reason);
        fallback.setDetectedSources(List.of());
        fallback.setRecommendedBehavior("fallback");
        return fallback;
    }

    private String generateFallbackDraft(String task) {
        return "Task: " + task + "\n\n[This is a fallback response. The AI service encountered an issue. Please try again.]";
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}