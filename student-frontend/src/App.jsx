import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { studentService } from './api/studentService';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StudentManager from './components/StudentManager';
import CourseManager from './components/CourseManager';
import AttendanceManager from './components/AttendanceManager';
import MarksManager from './components/MarksManager';
import DashboardManager from './components/DashboardManager';
import StudentForm from './components/StudentForm';
import './App.css';

export default function App() {
  // Empty state by default; populated directly from database
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching students from database:", err);
    }
  };

  useEffect(() => {
    loadStudents();

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleSaveStudent = async (formData) => {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
      } else {
        await studentService.createStudent(formData);
      }
      handleCloseModal();
      await loadStudents();
    } catch (err) {
      alert("Error saving record: " + err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      await studentService.deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      await loadStudents();
    } catch (err) {
      alert("Error deleting record: " + err.message);
    }
  };

  return (
    <Router>
      <div className="dashboard-container">
        <div
          className={`mobile-backdrop ${isSidebarOpen ? 'show' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : 'closed'}`}>
          <Sidebar onClose={handleCloseSidebar} />
        </div>

        <div className="main-wrapper">
          <Topbar onToggleSidebar={handleToggleSidebar} />

          <main className="content-workspace">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardManager />} />
              <Route
                path="/students"
                element={
                  <StudentManager
                    students={students}
                    onAddStudent={handleOpenAdd}
                    onEditStudent={handleOpenEdit}
                    onDeleteStudent={(student) => setStudentToDelete(student)}
                  />
                }
              />
              <Route path="/courses" element={<CourseManager />} />
              <Route path="/attendance" element={<AttendanceManager students={students} />} />
              <Route path="/marks" element={<MarksManager />} />
            </Routes>
          </main>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
              <StudentForm
                onSubmit={handleSaveStudent}
                editingStudent={editingStudent}
                onCancelEdit={handleCloseModal}
              />
            </div>
          </div>
        )}

        {studentToDelete && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {studentToDelete.firstName} {studentToDelete.lastName}
                </strong>
                ?
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setStudentToDelete(null)}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}