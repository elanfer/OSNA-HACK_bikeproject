package de.osnahack.bikeflow.controllers;

import de.osnahack.bikeflow.dto.Node;
import de.osnahack.bikeflow.dto.Way;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class WayController {
    @RequestMapping("/ways")
    @GetMapping
    public List<Way> ways() {
        List<Way> results = new ArrayList<>();
        List<Node> nodes = new ArrayList<>();
        nodes.add(new Node(58.1223f, 8.2232f));
        Way way = new Way(nodes);
        way.setType("way");
        results.add(way);
        return results;
    }
}
