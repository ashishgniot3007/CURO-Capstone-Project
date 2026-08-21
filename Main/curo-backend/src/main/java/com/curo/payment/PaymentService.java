package com.curo.payment;

import com.curo.booking.Booking;
import com.curo.booking.BookingRepository;
import com.curo.payment.dto.PaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentService {
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private BookingRepository bookingRepository;

    public PaymentResponse initiatePayment(Long bookingId, Double amount) {
        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setAmount(new BigDecimal(amount));
        payment.setStatus("INITIATED");
        payment.setIdempotencyKey(UUID.randomUUID().toString());
        Payment saved = paymentRepository.save(payment);

        // Mock: return a payment URL
        return new PaymentResponse(
                "http://localhost:8080/api/payments/mock-success/" + bookingId,
                saved.getId(),
                "INITIATED"
        );
    }

    public PaymentResponse getPaymentUrl(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return new PaymentResponse(
                "http://localhost:8080/api/payments/mock-success/" + bookingId,
                payment.getId(),
                payment.getStatus()
        );
    }

    @Transactional
    public void confirmPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus("SUCCESS");
        payment.setGatewayTxnId(UUID.randomUUID().toString());
        paymentRepository.save(payment);

        // Update booking status
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);
    }

    @Transactional
    public void failPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus("FAILED");
        paymentRepository.save(payment);

        // Update booking status and release slot (compensating action)
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
