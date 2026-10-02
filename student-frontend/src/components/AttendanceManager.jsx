import React, { useState } from 'react';
import { FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function AttendanceManager({ students }) {
  // Track attendance status for each student by ID
  const [attendance, setAttendance] = useState({});

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Calculate stats dynamically based on current selections
  const totalStudents = students.length;
  const presentCount = Object.values(attendance).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'Absent').length;

  return (
    <section className="attendance-manager">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Attendance</h2>
          <p>Mark student attendance by course</p>
        </div>
        <button className="btn-primary" onClick={() => alert("Attendance saved successfully!")}>
          Save Attendance
        </button>
      </div>

      {/* Filters and Summary Cards Row */}
      <div className="attendance-controls-card card">
        <div className="filter-row">
          <div className="input-group">
            <label>Select Date</label>
            <input type="date" defaultValue="2026-10-02" className="date-input" />
          </div>
          <div className="input-group">
            <label>Select Course</label>
            <select className="course-select">
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Electronics</option>
            </select>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="attendance-stats-row">
          <div className="mini-stat-card blue">
            <FiUsers size={20} />
            <div>
              <h4>{totalStudents}</h4>
              <p>Total Students</p>
            </div>
          </div>
          <div className="mini-stat-card green">
            <FiCheckCircle size={20} />
            <div>
              <h4>{presentCount}</h4>
              <p>Present</p>
            </div>
          </div>
          <div className="mini-stat-card red">
            <FiXCircle size={20} />
            <div>
              <h4>{absentCount}</h4>
              <p>Absent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card table-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>STUDENT ATTENDANCE</th>
              <th style={{ textAlign: 'right' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="2" className="empty-state">No students found. Add students to track attendance.</td>
              </tr>
            ) : (
              students.map((student) => {
                const currentStatus = attendance[student.id] || 'Present'; // Default to Present
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="student-row-info">
                        <div className="avatar-circle small-avatar">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div>
                          <span className="student-name">{student.firstName} {student.lastName}</span>
                          <span className="student-course-sub">{student.course || 'General'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="status-toggle-group">
                        <button 
                          type="button"
                          className={`toggle-pill present ${currentStatus === 'Present' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Present')}
                        >
                          Present
                        </button>
                        <button 
                          type="button"
                          className={`toggle-pill absent ${currentStatus === 'Absent' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}