package de.osnahack.bikeflow.jpa.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "custom_tags")
public class CustomTag {
    @Id
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
}
