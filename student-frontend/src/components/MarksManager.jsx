import React, { useState, useEffect } from 'react';
import { marksService } from '../api/marksService';
import { studentService } from '../api/studentService';
import { FiPlus, FiAward, FiTrash2, FiBarChart2 } from 'react-icons/fi';

export default function MarksManager() {
  const [marksList, setMarksList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form input state
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    course: '',
    marks: '',
    maxMarks: 100
  });

  // Load real data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [marksData, studentsData] = await Promise.all([
        marksService.getAllMarks(),
        studentService.getAllStudents()
      ]);

      const marksArr = Array.isArray(marksData) ? marksData : [];
      const studentsArr = Array.isArray(studentsData) ? studentsData : [];

      setMarksList(marksArr);
      setStudents(studentsArr);

      if (studentsArr.length > 0 && !formData.studentId) {
        setFormData((prev) => ({
          ...prev,
          studentId: studentsArr[0].id,
          course: studentsArr[0].course || ''
        }));
      }
    } catch (err) {
      console.error("Error loading data in MarksManager:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'studentId') {
      const selectedStudent = students.find((s) => String(s.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        studentId: value,
        course: selectedStudent ? selectedStudent.course || '' : prev.course
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add new marks record to backend
  const handleAddMarks = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.subject || !formData.marks) {
      alert("Please select a student and enter subject and marks.");
      return;
    }

    const selectedStudent = students.find((s) => String(s.id) === String(formData.studentId));

    const payload = {
      studentId: parseInt(formData.studentId),
      studentName: selectedStudent
        ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
        : "Student",
      course: formData.course || "General",
      subject: formData.subject,
      marks: Number(formData.marks),
      maxMarks: Number(formData.maxMarks) || 100
    };

    try {
      await marksService.createMarks(payload);
      setIsModalOpen(false);
      setFormData({
        studentId: students[0]?.id || '',
        subject: '',
        course: students[0]?.course || '',
        marks: '',
        maxMarks: 100
      });
      await loadData();
    } catch (err) {
      alert("Failed to save score: " + err.message);
    }
  };

  // Remove a marks record
  const handleDeleteMarks = async (id) => {
    try {
      await marksService.deleteMarks(id);
      setMarksList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete score: " + err.message);
    }
  };

  // Calculation metrics
  const totalSubmissions = marksList.length;
  const averagePercentage =
    totalSubmissions > 0
      ? (
          marksList.reduce((acc, curr) => acc + (curr.marks / curr.maxMarks) * 100, 0) /
          totalSubmissions
        ).toFixed(1)
      : '0.0';

  return (
    <section className="marks-manager">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h2>Marks & Grades</h2>
          <p>Record, manage, and view student exam scores ({totalSubmissions} total records)</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiPlus /> Add Marks
        </button>
      </div>

      {/* Summary Score Boxes */}
      <div className="marks-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card stat-box">
          <div className="stat-icon-wrapper purple">
            <FiAward size={24} />
          </div>
          <div>
            <span className="stat-label">Total Submissions</span>
            <h3>{totalSubmissions}</h3>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon-wrapper blue">
            <FiBarChart2 size={24} />
          </div>
          <div>
            <span className="stat-label">Average Score</span>
            <h3>{averagePercentage}%</h3>
          </div>
        </div>
      </div>

      {/* Marks Records Table */}
      <div className="card table-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>STUDENT NAME</th>
              <th>SUBJECT</th>
              <th>COURSE</th>
              <th>SCORE</th>
              <th>PERCENTAGE</th>
              <th style={{ textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Loading marks from database...
                </td>
              </tr>
            ) : marksList.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No marks recorded yet. Click "Add Marks" above to record student exam results.
                </td>
              </tr>
            ) : (
              marksList.map((item) => {
                const percentage = ((item.marks / item.maxMarks) * 100).toFixed(1);
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className="student-name">{item.studentName}</td>
                    <td>{item.subject}</td>
                    <td>{item.course}</td>
                    <td>
                      <strong>{item.marks}</strong> / {item.maxMarks}
                    </td>
                    <td>
                      <span
                        className="status-pill-badge active"
                        style={{
                          backgroundColor: percentage >= 75 ? '#dcfce7' : '#fef3c7',
                          color: percentage >= 75 ? '#16a34a' : '#d97706'
                        }}
                      >
                        {percentage}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDeleteMarks(item.id)}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        <FiTrash2 style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Marks Entry */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="modal-title">Record Student Marks</h3>

            <form onSubmit={handleAddMarks}>
              <div className="input-group">
                <label>Select Student</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>-- Select a Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (ID: {s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Subject / Exam Title</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g. Data Structures - Mid-term"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Course / Program</label>
                <input
                  type="text"
                  name="course"
                  placeholder="e.g. Computer Science"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Marks Scored</label>
                  <input
                    type="number"
                    name="marks"
                    placeholder="e.g. 85"
                    min="0"
                    max={formData.maxMarks}
                    value={formData.marks}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Maximum Marks</label>
                  <input
                    type="number"
                    name="maxMarks"
                    placeholder="100"
                    value={formData.maxMarks}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}