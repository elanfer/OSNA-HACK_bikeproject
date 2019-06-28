package de.osnahack.bikeflow.jpa.repositories;

import de.osnahack.bikeflow.jpa.entities.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<NodeEntity, Long> {
    @Query(value = "select st_asgeojson(the_geom) from osm_ways where osm_id = :osm_id", nativeQuery = true)
    List<String> findByIdsAndOrderByLatLon(Long osm_id);
}
