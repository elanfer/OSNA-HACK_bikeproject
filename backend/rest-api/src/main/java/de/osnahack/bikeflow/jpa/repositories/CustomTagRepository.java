package de.osnahack.bikeflow.jpa.repositories;

import de.osnahack.bikeflow.jpa.entities.CustomTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomTagRepository extends JpaRepository<CustomTag, Long> {
    List<CustomTag> findByWayId(Long wayId);
}
