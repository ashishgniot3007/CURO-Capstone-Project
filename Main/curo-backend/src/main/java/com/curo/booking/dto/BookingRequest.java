package com.curo.booking.dto;

public class BookingRequest {
    private Long slotId;
    private String idempotencyKey;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(Long slotId, String idempotencyKey) {
        this.slotId = slotId;
        this.idempotencyKey = idempotencyKey;
    }

    // Getters and Setters
    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
}