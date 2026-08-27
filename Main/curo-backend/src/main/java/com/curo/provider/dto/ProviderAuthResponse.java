package com.curo.provider.dto;

public class ProviderAuthResponse {
    private Long providerId;
    private String token;
    private String email;
    private String name;
    private String type;

    public ProviderAuthResponse() {}

    public ProviderAuthResponse(Long providerId, String token, String email, String name, String type) {
        this.providerId = providerId;
        this.token = token;
        this.email = email;
        this.name = name;
        this.type = type;
    }

    // Getters and Setters
    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}