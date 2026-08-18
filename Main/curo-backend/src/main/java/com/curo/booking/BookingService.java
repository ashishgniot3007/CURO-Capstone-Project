package com.curo.booking;

import com.curo.availability.AvailabilityService;
import com.curo.availability.Slot;
import com.curo.booking.dto.BookingRequest;
import com.curo.booking.dto.BookingResponse;
import com.curo.payment.PaymentService;
import com.curo.payment.dto.PaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BookingService {
    @Autowired private BookingRepository bookingRepository;
    @Autowired private AvailabilityService availabilityService;
    @Autowired private PaymentService paymentService;

    @Transactional
    public BookingResponse createBooking(BookingRequest req, Long userId) {
        // Check idempotency
        if (req.getIdempotencyKey() != null) {
            var existing = bookingRepository.findByIdempotencyKey(req.getIdempotencyKey());
            if (existing.isPresent()) {
                Booking booking = existing.get();
                PaymentResponse paymentResp = paymentService.getPaymentUrl(booking.getId());
                return new BookingResponse(
                        booking.getId(),
                        booking.getStatus(),
                        paymentResp.getPaymentUrl()
                );
            }
        }

        try {
            // Step 1: Lock slot (will throw if slot already locked/booked)
            Slot slot = availabilityService.lockSlot(req.getSlotId());

            // Step 2: Create booking with PENDING_PAYMENT
            Booking booking = new Booking(userId, req.getSlotId(), slot.getProviderId());
            booking.setIdempotencyKey(req.getIdempotencyKey());
            Booking saved = bookingRepository.save(booking);

            // Step 3: Initiate payment (mocked)
            PaymentResponse paymentResp = paymentService.initiatePayment(saved.getId(), 500.0);

            return new BookingResponse(
                    saved.getId(),
                    saved.getStatus(),
                    paymentResp.getPaymentUrl()
            );
        } catch (Exception e) {
            // If slot lock failed, slot remains AVAILABLE; no compensation needed
            throw e;
        }
    }

    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);
        availabilityService.markSlotAsBooked(booking.getSlotId());
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        // Compensating action: release slot
        availabilityService.releaseSlot(booking.getSlotId());
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> listByUser(Long userId) {
        return bookingRepository.findByUser Id(userId);
    }

    public List<Booking> listByProvider(Long providerId) {
        return bookingRepository.findByProviderId(providerId);
    }

    public List<Booking> listByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking getByIdAndUser(Long bookingId, Long userId) {
        return bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new RuntimeException("Booking not found or access denied"));
    }
}