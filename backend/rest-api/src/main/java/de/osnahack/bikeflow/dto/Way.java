package de.osnahack.bikeflow.dto;

import java.util.List;
import java.util.Map;

public class Way {
    private String wayId;
    private String type;
    private List<Node> nodes;

    private Map<String, String> osmTags;
    private Map<String, String> customTags;

    private Float state;

    public Way(List<Node> nodes, Map<String, String> osmTags) {
        this.nodes = nodes;
        this.osmTags = osmTags;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }


    public void setOsmTags(Map<String, String> osmTags) {
        this.osmTags = osmTags;
    }

    public Float getState() {
        return state;
    }

    public void setState(Float state) {
        this.state = state;
    }

    public Map<String, String> getCustomTags() {
        return customTags;
    }

    public void setCustomTags(Map<String, String> customTags) {
        this.customTags = customTags;
    }

    public void setWayId(String wayId) {
        this.wayId = wayId;
    }

    public String getWayId() {
        return wayId;
    }

    public Map<String, String> getOsmTags() {
        return osmTags;
    }
}
