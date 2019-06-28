package de.osnahack.bikeflow.jpa.entities;

import javax.persistence.*;

@Entity
@Table(name = "custom_tags")
public class CustomTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "custom_id")
    private Long customId;

    @Column(name = "way_id")
    private Long wayId;

    @Column(name = "tag_name")
    private String tagName;

    @Column(name = "tag_value")
    private String tagValue;

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getTagValue() {
        return tagValue;
    }

    public void setTagValue(String tagValue) {
        this.tagValue = tagValue;
    }

    public Long getWayId() {
        return wayId;
    }

    public void setWayId(Long wayId) {
        this.wayId = wayId;
    }
}
