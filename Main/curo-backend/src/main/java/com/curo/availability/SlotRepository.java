package com.curo.availability;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByProviderIdAndStatusAndStartTimeGreaterThanOrderByStartTime(
            Long providerId, String status, LocalDateTime startTime);

    List<Slot> findByProviderIdAndStatusAndStartTimeGreaterThanAndEndTimeLessThanOrderByStartTime(
            Long providerId, String status, LocalDateTime startTime, LocalDateTime endTime);

    @Modifying
    @Query("UPDATE Slot s SET s.status = 'LOCKED', s.version = s.version + 1 " +
           "WHERE s.id = :slotId AND s.status = 'AVAILABLE' AND s.version = :version")
    int lockSlotOptimistic(@Param("slotId") Long slotId, @Param("version") Integer version);

    @Modifying
    @Query("UPDATE Slot s SET s.status = 'AVAILABLE', s.version = s.version + 1 " +
           "WHERE s.id = :slotId")
    void releaseSlot(@Param("slotId") Long slotId);

    @Modifying
    @Query("UPDATE Slot s SET s.status = 'BOOKED', s.version = s.version + 1 " +
           "WHERE s.id = :slotId")
    void markAsBooked(@Param("slotId") Long slotId);
}
