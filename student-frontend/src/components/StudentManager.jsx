import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import StudentForm from './StudentForm';

export default function StudentManager({ students, onAddStudent, onEditStudent, onDeleteStudent }) {
  // 1. Declare viewMode state to fix the ReferenceError
  const [viewMode, setViewMode] = useState('cards');

  return (
    <section className="student-manager">
      {/* Header Section with View Switcher */}
      <div className="page-header">
        <div>
          <h2>Students</h2>
          <p>Manage student records and information ({students.length} total)</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Cards / Table View Switcher */}
          <div className="view-switcher">
            <button 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              Cards
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
          </div>

          {/* Add Student Button */}
          <button 
            className="btn-primary" 
            onClick={onAddStudent}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiPlus /> Add Student
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === 'cards' ? (
        <div className="student-cards-grid">
          {students.length === 0 ? (
            <p className="empty-state">No students found in the database.</p>
          ) : (
            students.map((student) => (
              <div className="student-card" key={student.id}>
                <div className="card-header">
                  <div className="avatar-circle">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </div>
                  <div className="header-info">
                    <h4>{student.firstName} {student.lastName}</h4>
                    <span className="roll-number">ID: {student.id}</span>
                  </div>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="card-body">
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Course:</strong> {student.course}</p>
                </div>
                <div className="card-footer">
                  <button className="btn-edit" onClick={() => onEditStudent(student)}>Edit</button>
                  <button className="btn-delete" onClick={() => onDeleteStudent(student)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card table-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>STUDENT NAME</th>
                <th>EMAIL</th>
                <th>COURSE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No students found in the database.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td className="student-name">{student.firstName} {student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-edit" 
                        onClick={() => onEditStudent(student)} 
                        style={{ marginRight: '8px', padding: '6px 12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => onDeleteStudent(student)} 
                        style={{ padding: '6px 12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}