package de.osnahack.bikeflow.dto;

public class Node {
    private Double latitude;
    private Double longitude;

    public Node(Double lat, Double lon) {
        this.latitude = lat;
        this.longitude = lon;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
