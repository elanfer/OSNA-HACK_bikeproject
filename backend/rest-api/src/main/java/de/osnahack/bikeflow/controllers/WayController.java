package de.osnahack.bikeflow.controllers;

import de.osnahack.bikeflow.dto.Node;
import de.osnahack.bikeflow.dto.Way;
import de.osnahack.bikeflow.jpa.entities.NodeEntity;
import de.osnahack.bikeflow.jpa.entities.WayEntity;
import de.osnahack.bikeflow.jpa.repositories.NodeRepository;
import de.osnahack.bikeflow.jpa.repositories.WaysRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class WayController {
    @Autowired
    private WaysRepository waysRepository;
    @Autowired
    private NodeRepository nodeRepository;

    @RequestMapping(value="/updateState",method = RequestMethod.POST)
    public void updateState(@RequestBody List<Map<String,String>> body){
        for (Map<String, String> map : body) {
            for (String nodeId : map.keySet()) {
                Optional<WayEntity> way = waysRepository.findById(Long.valueOf(nodeId));
                if(way.isPresent()){
                    WayEntity wayEntity = way.get();
                    wayEntity.setState(Float.valueOf(map.get(nodeId)));
                    waysRepository.save(wayEntity);
                }
            }
        }
    }

    @RequestMapping("/ways")
    @GetMapping
    public List<Way> ways(@RequestParam Float left, @RequestParam Float bottom,  @RequestParam Float right, @RequestParam Float top) {
        List<Way> results = new ArrayList<>();
        List<WayEntity> all = waysRepository.findWithinBoungingBox(left, bottom, right, top);
        for (WayEntity wayEntity : all) {
            ArrayList<Node> nodes = new ArrayList<>();
            Way way = new Way(nodes, wayEntity.getTags());
            way.setType("way");
            way.setState(wayEntity.getState());
            results.add(way);
            List<NodeEntity> nodesForWay = nodeRepository.findByIdsAndOrderByLatLon(wayEntity.getMembers().keySet().stream().map(Long::valueOf)
                    .collect(Collectors.toList()));
            for (NodeEntity nodeEntity : nodesForWay) {
                Node n = new Node(Float.valueOf(nodeEntity.getAttributes().get("lat")), Float.valueOf(nodeEntity.getAttributes().get("lon")));
                nodes.add(n);
            }
        }
        return results;
    }

    @RequestMapping("/waysExport")
    @GetMapping
    public List<WayEntity> dataExport() {
        List<WayEntity> all = waysRepository.findAll();
        return all;
    }
}
