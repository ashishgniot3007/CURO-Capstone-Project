package com.curo.payment;

import com.curo.payment.dto.PaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    @Autowired private PaymentService paymentService;

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Payment> getPaymentByBooking(@PathVariable Long bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Mock endpoint to simulate successful payment
    @PostMapping("/mock-success/{bookingId}")
    public ResponseEntity<String> mockPaymentSuccess(@PathVariable Long bookingId) {
        try {
            paymentService.confirmPayment(bookingId);
            return ResponseEntity.ok("Payment confirmed and booking status updated");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Mock endpoint to simulate failed payment
    @PostMapping("/mock-fail/{bookingId}")
    public ResponseEntity<String> mockPaymentFail(@PathVariable Long bookingId) {
        try {
            paymentService.failPayment(bookingId);
            return ResponseEntity.ok("Payment failed and booking cancelled");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/status/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentStatus(@PathVariable Long bookingId) {
        try {
            PaymentResponse response = paymentService.getPaymentUrl(bookingId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}