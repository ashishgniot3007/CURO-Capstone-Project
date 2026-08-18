package com.curo.availability;

import com.curo.availability.dto.SlotRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AvailabilityService {
    @Autowired private SlotRepository slotRepository;

    @Transactional
    public Slot lockSlot(Long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!"AVAILABLE".equals(slot.getStatus())) {
            throw new RuntimeException("Slot not available");
        }

        // Optimistic locking: only update if version matches
        int updated = slotRepository.lockSlotOptimistic(slotId, slot.getVersion());
        if (updated == 0) {
            throw new RuntimeException("Slot already booked (version conflict)");
        }

        return slotRepository.findById(slotId).get();
    }

    @Transactional
    public void releaseSlot(Long slotId) {
        slotRepository.releaseSlot(slotId);
    }

    @Transactional
    public void markSlotAsBooked(Long slotId) {
        slotRepository.markAsBooked(slotId);
    }

    public List<Slot> getAvailableSlots(Long providerId, LocalDateTime from, LocalDateTime to) {
        return slotRepository.findByProviderIdAndStatusAndStartTimeGreaterThanAndEndTimeLessThanOrderByStartTime(
                providerId, "AVAILABLE", from, to);
    }

    public List<Slot> getSlotsByProvider(Long providerId) {
        return slotRepository.findByProviderIdAndStatusAndStartTimeGreaterThanOrderByStartTime(
                providerId, "AVAILABLE", LocalDateTime.now());
    }

    @Transactional
    public Slot createSlot(Long providerId, SlotRequest req) {
        Slot slot = new Slot(providerId, req.getStartTime(), req.getEndTime());
        return slotRepository.save(slot);
    }

    @Transactional
    public Slot createSlot(Long providerId, LocalDateTime startTime, LocalDateTime endTime) {
        Slot slot = new Slot(providerId, startTime, endTime);
        return slotRepository.save(slot);
    }

    public Slot getSlotById(Long slotId) {
        return slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
    }
}