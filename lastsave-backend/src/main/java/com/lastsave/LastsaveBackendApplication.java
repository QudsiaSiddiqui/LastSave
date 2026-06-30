package com.lastsave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class LastsaveBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LastsaveBackendApplication.class, args);
	}
}
