package com.example.student.controller;

import com.example.student.entity.Marks;
import com.example.student.service.MarksService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin
public class MarksController {

    private final MarksService service;

    public MarksController(MarksService service) {
        this.service = service;
    }

    @GetMapping
    public List<Marks> getAll() {
        return service.getAllMarks();
    }

    @PostMapping
    public Marks create(@RequestBody Marks marks) {
        return service.saveMarks(marks);
    }
}