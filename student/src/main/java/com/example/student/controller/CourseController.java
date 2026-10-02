package com.example.student.controller;

import com.example.student.entity.Course;
import com.example.student.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173") // Allows Vite dev server requests
public class CourseController {

    @Autowired
    private CourseService courseService;

    // GET: http://localhost:8081/api/courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    // GET by ID: http://localhost:8081/api/courses/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }

    // POST: http://localhost:8081/api/courses
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course created = courseService.createCourse(course);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // DELETE: http://localhost:8081/api/courses/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        System.out.println(">>> Incoming DELETE request for Course ID: " + id);
        
        boolean isDeleted = courseService.deleteCourse(id);
        if (!isDeleted) {
            System.out.println(">>> Course ID " + id + " not found in database.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Course with ID " + id + " does not exist.");
        }
        
        System.out.println(">>> Course ID " + id + " deleted successfully.");
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }
}