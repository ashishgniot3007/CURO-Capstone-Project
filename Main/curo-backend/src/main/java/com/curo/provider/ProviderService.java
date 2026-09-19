package com.curo.provider;

import com.curo.provider.dto.ProviderSignupRequest;
import com.curo.provider.dto.ProviderLoginRequest;
import com.curo.provider.dto.ProviderAuthResponse;
import com.curo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProviderService {
    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Provider Signup
     */
    public ProviderAuthResponse signup(ProviderSignupRequest request) {
        // Validate email uniqueness
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered with another provider");
        }

        // Validate required fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getType() == null || (!request.getType().equals("DOCTOR") && !request.getType().equals("HOSPITAL"))) {
            throw new RuntimeException("Type must be DOCTOR or HOSPITAL");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        // Create provider
        Provider provider = new Provider(request.getName(), request.getEmail(), request.getType());
        provider.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        provider.setPhone(request.getPhone());
        provider.setSpeciality(request.getSpeciality());
        provider.setLicenseNumber(request.getLicenseNumber());
        provider.setDescription(request.getDescription());
        provider.setLat(request.getLat());
        provider.setLng(request.getLng());
        provider.setAddress(request.getAddress());
        provider.setCreatedAt(LocalDateTime.now());
        provider.setUpdatedAt(LocalDateTime.now());

        Provider savedProvider = providerRepository.save(provider);

        // Generate JWT token
        String token = jwtUtil.generateProviderToken(savedProvider.getId(), savedProvider.getEmail());

        return new ProviderAuthResponse(
            savedProvider.getId(),
            token,
            savedProvider.getEmail(),
            savedProvider.getName(),
            savedProvider.getType()
        );
    }

    /**
     * Provider Login
     */
    public ProviderAuthResponse login(ProviderLoginRequest request) {
        Optional<Provider> providerOpt = providerRepository.findByEmail(request.getEmail());

        if (providerOpt.isEmpty()) {
            throw new RuntimeException("Provider not found with email: " + request.getEmail());
        }

        Provider provider = providerOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), provider.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token
        String token = jwtUtil.generateProviderToken(provider.getId(), provider.getEmail());

        return new ProviderAuthResponse(
            provider.getId(),
            token,
            provider.getEmail(),
            provider.getName(),
            provider.getType()
        );
    }

    /**
     * Get provider by ID
     */
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Provider not found with id: " + id));
    }

    /**
     * Get provider by Email
     */
    public Provider getProviderByEmail(String email) {
        return providerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Provider not found with email: " + email));
    }

    /**
     * Update provider profile
     */
    public Provider updateProfile(Long providerId, ProviderSignupRequest request) {
        Provider provider = getProviderById(providerId);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            provider.setName(request.getName());
        }
        if (request.getPhone() != null) {
            provider.setPhone(request.getPhone());
        }
        if (request.getSpeciality() != null) {
            provider.setSpeciality(request.getSpeciality());
        }
        if (request.getLicenseNumber() != null) {
            provider.setLicenseNumber(request.getLicenseNumber());
        }
        if (request.getDescription() != null) {
            provider.setDescription(request.getDescription());
        }
        if (request.getLat() != null) {
            provider.setLat(request.getLat());
        }
        if (request.getLng() != null) {
            provider.setLng(request.getLng());
        }
        if (request.getAddress() != null) {
            provider.setAddress(request.getAddress());
        }

        provider.setUpdatedAt(LocalDateTime.now());
        return providerRepository.save(provider);
    }

    /**
     * Get all active providers
     */
    public List<Provider> getAllActiveProviders() {
        return providerRepository.findByIsActiveTrue();
    }

    /**
     * Get all verified providers
     */
    public List<Provider> getAllVerifiedProviders() {
        return providerRepository.findByIsVerifiedTrue();
    }

    /**
     * Get providers by speciality
     */
    public List<Provider> getProvidersBySpeciality(String speciality) {
        return providerRepository.findBySpeciality(speciality);
    }

    /**
     * Get providers by type
     */
    public List<Provider> getProvidersByType(String type) {
        return providerRepository.findByType(type);
    }

    /**
     * Search nearby providers
     */
    public List<Provider> findNearby(Float lat, Float lng, String speciality, String type) {
        return providerRepository.findNearby(lat, lng, speciality, type);
    }

    /**
     * Search providers with filters
     */
    public List<Provider> searchProviders(String speciality, String type) {
        return providerRepository.searchProviders(speciality, type);
    }

    /**
     * Update provider rating (called after review)
     */
    public void updateRating(Long providerId, Float newRating) {
        Provider provider = getProviderById(providerId);
        provider.setRating(newRating);
        provider.setUpdatedAt(LocalDateTime.now());
        providerRepository.save(provider);
    }

    /**
     * Toggle provider active status
     */
    public void toggleActiveStatus(Long providerId) {
        Provider provider = getProviderById(providerId);
        provider.setIsActive(!provider.getIsActive());
        provider.setUpdatedAt(LocalDateTime.now());
        providerRepository.save(provider);
    }

    /**
     * Verify provider (admin action)
     */
    public void verifyProvider(Long providerId) {
        Provider provider = getProviderById(providerId);
        provider.setIsVerified(true);
        provider.setUpdatedAt(LocalDateTime.now());
        providerRepository.save(provider);
    }
}