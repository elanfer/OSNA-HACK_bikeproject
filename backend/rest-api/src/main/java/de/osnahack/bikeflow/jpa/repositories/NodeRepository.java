package de.osnahack.bikeflow.jpa.repositories;

import de.osnahack.bikeflow.jpa.entities.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NodeRepository extends JpaRepository<NodeEntity, Long> {
}
