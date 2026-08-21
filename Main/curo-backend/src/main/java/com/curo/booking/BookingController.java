package com.curo.booking;

import com.curo.booking.dto.BookingRequest;
import com.curo.booking.dto.BookingResponse;
import com.curo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired private BookingService bookingService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest req,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            BookingResponse response = bookingService.createBooking(req, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(
            @PathVariable Long id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            Booking booking = bookingService.getByIdAndUser(id, userId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Booking>> listMyBookings(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<Booking> bookings = bookingService.listByUser(userId);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            Booking booking = bookingService.getByIdAndUser(id, userId);
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }

    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }
}
