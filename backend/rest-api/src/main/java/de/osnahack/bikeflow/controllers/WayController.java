package de.osnahack.bikeflow.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.osnahack.bikeflow.dto.Node;
import de.osnahack.bikeflow.dto.Way;
import de.osnahack.bikeflow.jpa.entities.CustomTag;
import de.osnahack.bikeflow.jpa.entities.WayEntity;
import de.osnahack.bikeflow.jpa.repositories.CustomTagRepository;
import de.osnahack.bikeflow.jpa.repositories.NodeRepository;
import de.osnahack.bikeflow.jpa.repositories.WaysRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RestController
public class WayController {
    @Autowired
    private WaysRepository waysRepository;
    @Autowired
    private NodeRepository nodeRepository;
    @Autowired
    private CustomTagRepository customTagRepository;

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

    @CrossOrigin(origins = "*")
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
            List<String> geoJsonsOfWays = nodeRepository.findByIdsAndOrderByLatLon(wayEntity.getId());
            ObjectMapper objectMapper = new ObjectMapper();
            for (String geoJson : geoJsonsOfWays) {
                try {
                    Map<String, ArrayList> map = objectMapper.readValue(geoJson, Map.class);
                    ArrayList<ArrayList<Double>> coordinates = map.get("coordinates");
                    for (ArrayList<Double> coordinate : coordinates) {
                        nodes.add(new Node(coordinate.get(1), coordinate.get(0)));
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            way.setNodes(nodes);
            List<CustomTag> customTags = customTagRepository.findByWayId(wayEntity.getId());
            Map<String, String> customTagMap = new HashMap<>();
            for (CustomTag customTag : customTags) {
                customTagMap.put(customTag.getTagName(), customTag.getTagValue());
            }
            way.setCustomTags(customTagMap);
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
