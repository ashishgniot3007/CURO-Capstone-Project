package com.LoginRegister.example.requests;

public class LoginResponse {

    private boolean success;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String role) {
        this.success = success;
        this.role = role;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}