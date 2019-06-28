package de.osnahack.bikeflow.jpa.entities;

import com.vladmihalcea.hibernate.type.basic.PostgreSQLHStoreType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "osm_ways")
@TypeDef(name = "hstore", typeClass = PostgreSQLHStoreType.class)
public class WayEntity {
    @Id
    @Column(name = "osm_id")
    private Long id;

    @Type(type = "hstore")
    @Column(columnDefinition = "hstore")
    private Map<String, String> members = new HashMap<>();

    @Type(type = "hstore")
    @Column(columnDefinition = "hstore")
    private Map<String, String> tags = new HashMap<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Map<String, String> getMembers() {
        return members;
    }

    public void setMembers(Map<String, String> members) {
        this.members = members;
    }

    public Map<String, String> getTags() {
        return tags;
    }

    public void setTags(Map<String, String> tags) {
        this.tags = tags;
    }
}
