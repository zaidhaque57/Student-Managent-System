package com.example.student.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String course;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private Double marks;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks;

    // Default Constructor
    public Marks() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }

    // Helper method to calculate percentage automatically
    public Double getPercentage() {
        if (maxMarks == null || maxMarks == 0) return 0.0;
        return (marks / maxMarks) * 100;
    }
}