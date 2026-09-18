package com.curo;

import com.curo.availability.AvailabilityService;
import com.curo.availability.Slot;
import com.curo.booking.BookingService;
import com.curo.booking.dto.BookingRequest;
import com.curo.provider.Provider;
import com.curo.provider.ProviderService;
import com.curo.provider.dto.ProviderAuthResponse;
import com.curo.provider.dto.ProviderSignupRequest;
import com.curo.user.UserService;
import com.curo.user.dto.AuthRequest;
import com.curo.user.dto.AuthResponse;
import com.curo.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DataPopulationAndVerificationTest {

    @Autowired
    private ProviderService providerService;

    @Autowired
    private UserService userService;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    public void populateAndVerifyData() {
        System.out.println("=== STARTING DATA POPULATION ===");

        // 1. Create Doctors
        String[] specialities = {"Cardiology", "Neurology", "Dermatology", "Pediatrics", "Orthopedics", "General Practice"};
        String[] names = {"Dr. Alice Smith", "Dr. Bob Jones", "Dr. Carol White", "Dr. David Brown", "Dr. Eve Davis", "Dr. Frank Miller"};
        
        Long firstDoctorId = null;
        String firstDoctorToken = null;

        for (int i = 0; i < names.length; i++) {
            String email = "doctor" + i + "_" + System.currentTimeMillis() + "@test.curo.com";
            ProviderSignupRequest req = new ProviderSignupRequest();
            req.setName(names[i]);
            req.setEmail(email);
            req.setPassword("password123");
            req.setType("DOCTOR");
            req.setPhone("555-100" + i);
            req.setSpeciality(specialities[i]);
            req.setLicenseNumber("LIC" + System.currentTimeMillis() + i);
            req.setDescription("Experienced " + specialities[i] + " specialist.");
            req.setLat(40.7128f + (i * 0.01f));
            req.setLng(-74.0060f + (i * 0.01f));
            req.setAddress("12" + i + " Medical Park, NY");
            
            try {
                ProviderAuthResponse resp = providerService.signup(req);
                System.out.println("Created Doctor: " + names[i] + " (" + specialities[i] + ") - ID: " + resp.getProviderId());
                if (firstDoctorId == null) {
                    firstDoctorId = resp.getProviderId();
                    firstDoctorToken = resp.getToken();
                }

                // Create 3 slots for each doctor
                LocalDateTime now = LocalDateTime.now().plusDays(1).withHour(9).withMinute(0).withSecond(0).withNano(0);
                for (int j = 0; j < 3; j++) {
                    LocalDateTime start = now.plusHours(j);
                    LocalDateTime end = start.plusMinutes(45);
                    availabilityService.createSlot(resp.getProviderId(), start, end);
                }
                System.out.println("  -> Created 3 availability slots for " + names[i]);
            } catch (Exception e) {
                System.out.println("Skipped creating doctor: " + names[i] + " - " + e.getMessage());
            }
        }

        // 2. Create Patients
        String[] patientNames = {"Patient John", "Patient Mary"};
        Long firstPatientId = null;
        String firstPatientToken = null;

        for (int i = 0; i < patientNames.length; i++) {
            String email = "patient" + i + "_" + System.currentTimeMillis() + "@test.curo.com";
            AuthRequest req = new AuthRequest();
            req.setName(patientNames[i]);
            req.setEmail(email);
            req.setPassword("patient123");
            req.setPhone("555-200" + i);
            
            try {
                AuthResponse resp = userService.signup(req);
                System.out.println("Created Patient: " + patientNames[i] + " - ID: " + resp.getUserId());
                if (firstPatientId == null) {
                    firstPatientId = resp.getUserId();
                    firstPatientToken = resp.getToken();
                }
            } catch (Exception e) {
                System.out.println("Skipped creating patient: " + patientNames[i] + " - " + e.getMessage());
            }
        }

        System.out.println("\n=== VERIFYING REQUIREMENTS ===");

        // Verify 1: Doctors appear in /doctors (getAllActiveProviders)
        List<Provider> activeProviders = providerService.getAllActiveProviders();
        assertTrue(activeProviders.size() >= 6, "Should have at least 6 active providers");
        System.out.println("✓ Verification 1: Doctors appear in active providers list. Total: " + activeProviders.size());

        // Verify 2 & 3: Search by speciality
        List<Provider> cardiologists = providerService.getProvidersBySpeciality("Cardiology");
        assertFalse(cardiologists.isEmpty(), "Should find at least one Cardiology doctor");
        System.out.println("✓ Verification 2 & 3: Search/filter by speciality works. Found " + cardiologists.size() + " Cardiologists.");

        // Verify 4: Doctors have available slots
        assertNotNull(firstDoctorId, "First doctor should be created");
        List<Slot> slots = availabilityService.getSlotsByProvider(firstDoctorId);
        assertTrue(slots.size() >= 3, "Doctor should have at least 3 available slots");
        System.out.println("✓ Verification 4: Doctors have available slots. Found " + slots.size() + " slots for first doctor.");

        // Verify 5: Patients can book a slot
        assertNotNull(firstPatientId, "First patient should be created");
        Slot slotToBook = slots.get(0);
        
        BookingRequest bookingReq = new BookingRequest();
        bookingReq.setSlotId(slotToBook.getId());
        bookingReq.setIdempotencyKey(UUID.randomUUID().toString());
        
        try {
            bookingService.createBooking(bookingReq, firstPatientId);
            System.out.println("✓ Verification 5: Patient successfully booked slot " + slotToBook.getId());
        } catch (Exception e) {
            fail("Patient should be able to book slot: " + e.getMessage());
        }

        // Verify 7: Already-booked slot cannot be booked again
        try {
            BookingRequest retryReq = new BookingRequest();
            retryReq.setSlotId(slotToBook.getId());
            retryReq.setIdempotencyKey(UUID.randomUUID().toString()); // New key to bypass idempotency check
            bookingService.createBooking(retryReq, firstPatientId);
            fail("Should not be able to book an already booked slot");
        } catch (Exception e) {
            System.out.println("✓ Verification 7: Already-booked slot cannot be booked again (Caught expected exception: " + e.getMessage() + ")");
        }

        // Verify 6: Doctors cannot book appointments as themselves (Test JwtUtil logic)
        try {
            jwtUtil.extractUserId(firstDoctorToken);
            fail("Should have thrown exception when extracting USER ID from PROVIDER token");
        } catch (RuntimeException e) {
            assertTrue(e.getMessage().contains("Invalid token type for user"), "Expected invalid token message");
            System.out.println("✓ Verification 6: Doctors cannot act as patients using their provider token (Caught expected exception: " + e.getMessage() + ")");
        }

        System.out.println("=== DATA POPULATION AND VERIFICATION COMPLETE ===");
    }
}
