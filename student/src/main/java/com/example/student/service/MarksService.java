package com.example.student.service;

import com.example.student.entity.Marks;
import com.example.student.repository.MarksRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MarksService {

    private final MarksRepository repository;

    public MarksService(MarksRepository repository) {
        this.repository = repository;
    }

    public List<Marks> getAllMarks() {
        return repository.findAll();
    }

    public Marks saveMarks(Marks marks) {
        return repository.save(marks);
    }
}