package com.curo.provider;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findBySpeciality(String speciality);

    List<Provider> findByType(String type);

    @Query("SELECT p FROM Provider p WHERE p.speciality = :speciality AND SQRT(POWER(p.lat - :lat, 2) + POWER(p.lng - :lng, 2)) < 0.1")
    List<Provider> findNearby(@Param("lat") Float lat, @Param("lng") Float lng, @Param("speciality") String speciality);
}
