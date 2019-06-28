package de.osnahack.bikeflow.dto;

public class Node {
    private Float latitude;
    private Float longitude;

    public Node(Float lat, Float lon) {
        this.latitude = lat;
        this.longitude = lon;
    }

    public Float getLatitude() {
        return latitude;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitude() {
        return longitude;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }
}
