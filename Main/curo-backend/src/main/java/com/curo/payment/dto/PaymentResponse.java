package com.curo.payment.dto;

public class PaymentResponse {
    private String paymentUrl;
    private Long paymentId;
    private String status;

    // Constructors
    public PaymentResponse() {}

    public PaymentResponse(String paymentUrl, Long paymentId) {
        this.paymentUrl = paymentUrl;
        this.paymentId = paymentId;
    }

    public PaymentResponse(String paymentUrl, Long paymentId, String status) {
        this.paymentUrl = paymentUrl;
        this.paymentId = paymentId;
        this.status = status;
    }

    // Getters and Setters
    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}