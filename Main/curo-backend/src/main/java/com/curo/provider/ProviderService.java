package com.curo.provider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProviderService {
    @Autowired private ProviderRepository providerRepository;

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public Provider getById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    @Transactional
    public Provider save(Provider provider) {
        if (provider.getRating() == null) {
            provider.setRating(0f);
        }
        if (provider.getReviewsCount() == null) {
            provider.setReviewsCount(0);
        }
        return providerRepository.save(provider);
    }

    public List<Provider> searchBySpeciality(String speciality) {
        return providerRepository.findBySpeciality(speciality);
    }

    public List<Provider> searchByType(String type) {
        return providerRepository.findByType(type);
    }

    public List<Provider> searchNearby(Float lat, Float lng, String speciality) {
        return providerRepository.findNearby(lat, lng, speciality);
    }

    public List<Provider> search(String speciality, Double lat, Double lng) {
        if (speciality != null && lat != null && lng != null) {
            return searchNearby(lat.floatValue(), lng.floatValue(), speciality);
        } else if (speciality != null) {
            return searchBySpeciality(speciality);
        }
        return getAllProviders();
    }

    @Transactional
    public void updateRating(Long providerId, Float newRating, Integer reviewsCount) {
        Provider provider = getById(providerId);
        provider.setRating(newRating);
        provider.setReviewsCount(reviewsCount);
        providerRepository.save(provider);
    }
}