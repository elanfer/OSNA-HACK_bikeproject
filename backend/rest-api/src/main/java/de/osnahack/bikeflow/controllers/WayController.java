package de.osnahack.bikeflow.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WayController {
    @RequestMapping("/greeting")
    @GetMapping
    public String greeting() {
        return "bla";
    }
}
