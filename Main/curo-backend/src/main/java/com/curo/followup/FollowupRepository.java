package com.curo.followup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FollowupRepository extends JpaRepository<Followup, Long> {
    List<Followup> findByAppointmentId(Long appointmentId);
}
