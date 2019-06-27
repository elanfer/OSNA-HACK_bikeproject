package de.osnahack.bikeflow.dto;

import java.util.List;
import java.util.Map;

public class Way {
    private String type;
    private List<Node> nodes;

    private Map<String, String> normalizedTags;

    public Way(List<Node> nodes, Map<String, String> normalizedTags) {
        this.nodes = nodes;
        this.normalizedTags = normalizedTags;
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

    public Map<String, String> getNormalizedTags() {
        return normalizedTags;
    }

    public void setNormalizedTags(Map<String, String> normalizedTags) {
        this.normalizedTags = normalizedTags;
    }
}
