package com.curo.followup;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "followups")
public class Followup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long appointmentId;

    @Column
    private LocalDateTime nextVisitDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Followup() {}

    public Followup(Long appointmentId, LocalDateTime nextVisitDate) {
        this.appointmentId = appointmentId;
        this.nextVisitDate = nextVisitDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDateTime getNextVisitDate() {
        return nextVisitDate;
    }

    public void setNextVisitDate(LocalDateTime nextVisitDate) {
        this.nextVisitDate = nextVisitDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}