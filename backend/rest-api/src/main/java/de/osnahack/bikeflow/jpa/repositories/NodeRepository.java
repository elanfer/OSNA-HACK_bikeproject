package de.osnahack.bikeflow.jpa.repositories;

import de.osnahack.bikeflow.dto.Node;
import de.osnahack.bikeflow.jpa.entities.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<NodeEntity, Long> {
    @Query(value = "select * from osm_nodes where osm_id in (:ids) order by ST_YMax(the_geom), ST_XMin(the_geom)", nativeQuery = true)
    List<NodeEntity> findByIdsAndOrderByLatLon(List<Long> ids);
}
