package com.curo.booking.dto;

public class BookingResponse {
    private Long bookingId;
    private String status;
    private String paymentUrl;
    private String message;

    // Constructors
    public BookingResponse() {}

    public BookingResponse(Long bookingId, String status, String paymentUrl) {
        this.bookingId = bookingId;
        this.status = status;
        this.paymentUrl = paymentUrl;
    }

    public BookingResponse(Long bookingId, String status, String paymentUrl, String message) {
        this.bookingId = bookingId;
        this.status = status;
        this.paymentUrl = paymentUrl;
        this.message = message;
    }

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}