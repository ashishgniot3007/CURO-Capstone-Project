package com.curo.provider;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Provider> findBySpeciality(String speciality);
    
    List<Provider> findByType(String type);
    
    List<Provider> findByIsActiveTrue();
    
    List<Provider> findByIsVerifiedTrue();
    
    @Query(value = "SELECT * FROM providers p WHERE " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(p.lat)) * cos(radians(p.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.lat)))) < 50 " +
            "AND p.is_active = true " +
            "AND (:speciality IS NULL OR p.speciality = :speciality) " +
            "AND (:type IS NULL OR p.type = :type) " +
            "ORDER BY rating DESC",
            nativeQuery = true)
    List<Provider> findNearby(@Param("lat") Float lat, @Param("lng") Float lng, @Param("speciality") String speciality, @Param("type") String type);
    
    @Query("SELECT p FROM Provider p WHERE " +
            "p.isActive = true AND " +
            "(:speciality IS NULL OR p.speciality = :speciality) AND " +
            "(:type IS NULL OR p.type = :type)")
    List<Provider> searchProviders(@Param("speciality") String speciality, @Param("type") String type);
}