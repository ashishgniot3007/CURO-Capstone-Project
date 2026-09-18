package com.curo.availability;

import com.curo.availability.dto.SlotRequest;
import com.curo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/providers/{providerId}/slots")
@CrossOrigin(origins = "*")
public class AvailabilityController {
    @Autowired private AvailabilityService availabilityService;
    @Autowired private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Slot>> getSlots(
            @PathVariable Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        try {
            List<Slot> slots = availabilityService.getAvailableSlots(providerId, from, to);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Slot> createSlot(
            @PathVariable Long providerId,
            @RequestBody SlotRequest req,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }
            Long tokenProviderId = jwtUtil.extractProviderId(authHeader.substring(7));
            if (!providerId.equals(tokenProviderId)) {
                return ResponseEntity.status(403).build();
            }
            Slot slot = availabilityService.createSlot(providerId, req);
            return ResponseEntity.ok(slot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{slotId}")
    public ResponseEntity<Slot> getSlot(@PathVariable Long slotId) {
        try {
            Slot slot = availabilityService.getSlotById(slotId);
            return ResponseEntity.ok(slot);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
