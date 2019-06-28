package de.osnahack.bikeflow.jpa.repositories;

import de.osnahack.bikeflow.jpa.entities.WayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaysRepository extends JpaRepository<WayEntity, Long> {
    @Query(value = "SELECT * " +
            "FROM osm_ways w " +
            "WHERE w.the_geom && ST_MakeEnvelope(:left, :bottom, :right, :top) " +
            "AND name is not null and tag_value not in ('footway', 'service')", nativeQuery = true)
    List<WayEntity> findWithinBoungingBox(@Param("left") Float left, @Param("bottom") Float bottom,
                                          @Param("right") Float right, @Param("top") Float top);
}