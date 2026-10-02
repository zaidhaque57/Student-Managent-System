import React, { useState, useEffect } from 'react';
import { studentService } from '../api/studentService';
import { courseService } from '../api/courseService';
import { marksService } from '../api/marksService';
import { FiUsers, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import FullCalendarWidget from './FullCalendarWidget';

// Initial Raw Seed Data to guarantee rich UI display
const initialRawStudents = [
  { id: 101, firstName: "Rahul", lastName: "Sharma", email: "rahul@example.com", course: "Computer Science", active: true },
  { id: 102, firstName: "Priya", lastName: "Patel", email: "priya@example.com", course: "Information Technology", active: true },
  { id: 103, firstName: "Arjun", lastName: "Singh", email: "arjun@example.com", course: "Electronics", active: false },
  { id: 104, firstName: "Sneha", lastName: "Gupta", email: "sneha@example.com", course: "Mechanical Engineering", active: true },
  { id: 105, firstName: "Zaid", lastName: "Haque", email: "zaid@example.com", course: "Diploma CS", active: true },
  { id: 106, firstName: "Ritik", lastName: "Raj", email: "ritik@example.com", course: "Diploma Electronics", active: false }
];

const initialRawMarks = [
  { id: 1, studentName: "Rahul Sharma", subject: "Data Structures", course: "Mid-term", marks: 85, maxMarks: 100 },
  { id: 2, studentName: "Priya Patel", subject: "Database Management", course: "Final", marks: 92, maxMarks: 100 },
  { id: 3, studentName: "Arjun Singh", subject: "Digital Electronics", course: "Mid-term", marks: 78, maxMarks: 100 },
  { id: 4, studentName: "Rahul Sharma", subject: "Algorithms", course: "Final", marks: 88, maxMarks: 100 },
  { id: 5, studentName: "Zaid Haque", subject: "Operating Systems", course: "Mid-term", marks: 76, maxMarks: 100 }
];

export default function DashboardManager() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Attempt to fetch live data from Spring Boot REST endpoints
        const [studentData, courseData, marksData] = await Promise.allSettled([
          studentService.getAllStudents(),
          courseService ? courseService.getAllCourses() : Promise.resolve([]),
          marksService ? marksService.getAllMarks() : Promise.resolve([])
        ]);

        // Use backend data if available; otherwise populate with raw sample data
        const fetchedStudents = (studentData.status === 'fulfilled' && studentData.value.length > 0)
          ? studentData.value
          : initialRawStudents;

        const fetchedCourses = (courseData.status === 'fulfilled' && courseData.value.length > 0)
          ? courseData.value
          : [
              { id: 1, name: "Computer Science", code: "CS-101", studentsCount: 45 },
              { id: 2, name: "Information Technology", code: "IT-201", studentsCount: 38 },
              { id: 3, name: "Electronics", code: "EC-301", studentsCount: 30 },
              { id: 4, name: "Mechanical Engineering", code: "ME-401", studentsCount: 25 }
            ];

        const fetchedMarks = (marksData.status === 'fulfilled' && marksData.value.length > 0)
          ? marksData.value
          : initialRawMarks;

        setStudents(fetchedStudents);
        setCourses(fetchedCourses);
        setMarks(fetchedMarks);
      } catch (err) {
        console.warn("Backend not reached, loading default raw data:", err);
        setStudents(initialRawStudents);
        setMarks(initialRawMarks);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p style={{ padding: '24px' }}>Loading dashboard data...</p>;
  }

  return (
    <section className="dashboard-manager">
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Dashboard</h2>
          <p>Welcome to the Student Management System</p>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="marks-stats-grid" style={{ marginBottom: '28px' }}>
        <div className="card stat-box">
          <div className="stat-icon-wrapper blue"><FiUsers size={22} /></div>
          <div>
            <span className="stat-label">Total Students</span>
            <h3>{students.length}</h3>
          </div>
        </div>
        <div className="card stat-box">
          <div className="stat-icon-wrapper yellow"><FiBookOpen size={22} /></div>
          <div>
            <span className="stat-label">Total Courses</span>
            <h3>{courses.length}</h3>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout (Grid) */}
      <div className="dashboard-main-layout">
        
        {/* Left Column: Recent Students & Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card dashboard-card">
            <h3 className="section-title">Recent Students</h3>
            <div className="styled-item-list">
              {students.slice(0, 4).map((student, idx) => {
                const isActive = student.active !== undefined ? student.active : idx % 2 === 0;
                return (
                  <div className={`styled-item-box ${idx === 0 ? 'highlighted' : ''}`} key={student.id}>
                    <div className="avatar-circle small-avatar" style={{ background: '#2563eb' }}>
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div className="item-details">
                      <h4>{student.firstName} {student.lastName}</h4>
                      <p>{student.course || 'General Engineering'}</p>
                    </div>
                    <span className={`status-pill-badge ${isActive ? 'active' : 'inactive'}`}>
                      {isActive ? 'Active' : 'InActive'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="card-footer-link">
              <Link to="/students">View All Students <FiArrowRight /></Link>
            </div>
          </div>

          {/* Full Calendar Widget */}
          <FullCalendarWidget />

        </div>

        {/* Right Column: Recent Marks */}
        <div>
          <div className="card dashboard-card">
            <h3 className="section-title">Recent Marks</h3>
            <div className="styled-item-list">
              {marks.slice(0, 4).map((item) => {
                const percentage = ((item.marks / item.maxMarks) * 100).toFixed(1);
                return (
                  <div className="styled-mark-box" key={item.id}>
                    <div className="item-details">
                      <h4>{item.studentName}</h4>
                      <p>{item.subject} - {item.course}</p>
                    </div>
                    <div className="mark-score-info">
                      <span className="score-fraction">{item.marks}/{item.maxMarks}</span>
                      <span className="score-percentage">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card-footer-link">
              <Link to="/marks">View All Marks <FiArrowRight /></Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}