package com.curo.provider;

import com.curo.provider.dto.ProviderSignupRequest;
import com.curo.provider.dto.ProviderLoginRequest;
import com.curo.provider.dto.ProviderAuthResponse;
import com.curo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/providers")
@CrossOrigin(origins = "*")
public class ProviderController {
    @Autowired
    private ProviderService providerService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Provider Signup
     * POST /api/providers/auth/signup
     */
    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody ProviderSignupRequest request) {
        try {
            ProviderAuthResponse response = providerService.signup(request);
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Provider Login
     * POST /api/providers/auth/login
     */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody ProviderLoginRequest request) {
        try {
            ProviderAuthResponse response = providerService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all providers (public)
     * GET /api/providers
     */
    @GetMapping
    public ResponseEntity<?> getAllProviders(
            @RequestParam(required = false) String speciality,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Float lat,
            @RequestParam(required = false) Float lng) {
        try {
            List<Provider> providers;

            if (lat != null && lng != null) {
                providers = providerService.findNearby(lat, lng, speciality, type);
            } else if (speciality != null || type != null) {
                providers = providerService.searchProviders(speciality, type);
            } else {
                providers = providerService.getAllActiveProviders();
            }

            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get provider by ID (public)
     * GET /api/providers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable Long id) {
        try {
            Provider provider = providerService.getProviderById(id);
            return ResponseEntity.ok(provider);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get provider profile (provider only)
     * GET /api/providers/me/profile
     */
    @GetMapping("/me/profile")
    public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String token) {
        try {
            String bearerToken = token.substring(7);
            Long providerId = jwtUtil.extractProviderId(bearerToken);
            Provider provider = providerService.getProviderById(providerId);
            return ResponseEntity.ok(provider);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
    }

    /**
     * Update provider profile (provider only)
     * PUT /api/providers/me/profile
     */
    @PutMapping("/me/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody ProviderSignupRequest request) {
        try {
            String bearerToken = token.substring(7);
            Long providerId = jwtUtil.extractProviderId(bearerToken);
            Provider updated = providerService.updateProfile(providerId, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
    }

    /**
     * Get providers by speciality
     * GET /api/providers/filter/speciality?speciality=Cardiology
     */
    @GetMapping("/filter/speciality")
    public ResponseEntity<?> getBySpeciality(@RequestParam String speciality) {
        try {
            List<Provider> providers = providerService.getProvidersBySpeciality(speciality);
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get providers by type
     * GET /api/providers/filter/type?type=DOCTOR
     */
    @GetMapping("/filter/type")
    public ResponseEntity<?> getByType(@RequestParam String type) {
        try {
            List<Provider> providers = providerService.getProvidersByType(type);
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Toggle provider active status (provider only)
     * POST /api/providers/me/toggle-active
     */
    @PostMapping("/me/toggle-active")
    public ResponseEntity<?> toggleActive(@RequestHeader("Authorization") String token) {
        try {
            String bearerToken = token.substring(7);
            Long providerId = jwtUtil.extractProviderId(bearerToken);
            providerService.toggleActiveStatus(providerId);
            return ResponseEntity.ok(Map.of("message", "Status updated"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
    }

    /**
     * Get provider statistics (provider only)
     * GET /api/providers/me/stats
     */
    @GetMapping("/me/stats")
    public ResponseEntity<?> getStats(@RequestHeader("Authorization") String token) {
        try {
            String bearerToken = token.substring(7);
            Long providerId = jwtUtil.extractProviderId(bearerToken);
            Provider provider = providerService.getProviderById(providerId);

            Map<String, Object> stats = new HashMap<>();
            stats.put("providerId", provider.getId());
            stats.put("name", provider.getName());
            stats.put("type", provider.getType());
            stats.put("speciality", provider.getSpeciality());
            stats.put("rating", provider.getRating());
            stats.put("reviewsCount", provider.getReviewsCount());
            stats.put("isActive", provider.getIsActive());
            stats.put("isVerified", provider.getIsVerified());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
    }
}