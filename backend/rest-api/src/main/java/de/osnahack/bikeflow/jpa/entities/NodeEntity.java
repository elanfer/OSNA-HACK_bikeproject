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
@Table(name = "osm_nodes")
@TypeDef(name = "hstore", typeClass = PostgreSQLHStoreType.class)
public class NodeEntity {
    @Id
    @Column(name = "osm_id")
    private Long id;

    @Type(type = "hstore")
    @Column(columnDefinition = "hstore")
    private Map<String, String> attributes = new HashMap<>();

    public Map<String, String> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, String> attributes) {
        this.attributes = attributes;
    }
}
