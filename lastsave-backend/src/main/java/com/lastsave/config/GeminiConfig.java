package com.lastsave.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "gemini")
public class GeminiConfig {

    private Api api = new Api();

    public Api getApi() { return api; }
    public void setApi(Api api) { this.api = api; }

    public static class Api {
        private String key;

        public String getKey() { return key; }
        public void setKey(String key) { this.key = key; }
    }
}