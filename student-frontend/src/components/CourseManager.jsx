import React, { useState, useEffect } from 'react';
import { courseService } from '../api/courseService';
import { FiPlus, FiBookOpen, FiTrash2, FiUsers, FiUserCheck, FiDollarSign, FiClock } from 'react-icons/fi';

export default function CourseManager() {
  // Initial state is an empty array; no reference to initialCourses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form input matching your MySQL table schema (code, name, duration, fees, instructor, students)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    duration: '4 Years',
    fees: '',
    instructor: '',
    students: 0
  });

  // Fetch courses from Spring Boot backend on mount
  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert("Please fill in course name and code.");
      return;
    }

    const payload = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      duration: formData.duration || "4 Years",
      fees: parseFloat(formData.fees) || 0,
      instructor: formData.instructor || "Assigned Faculty",
      students: parseInt(formData.students) || 0
    };

    try {
      await courseService.createCourse(payload);
      setIsModalOpen(false);
      setFormData({
        name: '',
        code: '',
        duration: '4 Years',
        fees: '',
        instructor: '',
        students: 0
      });
      await loadCourses();
    } catch (err) {
      alert("Error adding course: " + err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await courseService.deleteCourse(id);
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      alert("Error deleting course: " + err.message);
    }
  };

  return (
    <section className="course-manager">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Courses</h2>
          <p>Manage curriculum, course codes, and assigned faculty ({courses.length} active programs)</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiPlus /> Add Course
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="marks-stats-grid" style={{ marginBottom: '28px' }}>
        <div className="card stat-box">
          <div className="stat-icon-wrapper yellow">
            <FiBookOpen size={24} />
          </div>
          <div>
            <span className="stat-label">Total Programs</span>
            <h3>{courses.length}</h3>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon-wrapper blue">
            <FiUsers size={24} />
          </div>
          <div>
            <span className="stat-label">Total Course Enrollment</span>
            <h3>{courses.reduce((acc, curr) => acc + (curr.students || 0), 0)}</h3>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="student-cards-grid">
        {loading ? (
          <p className="empty-state">Loading courses from database...</p>
        ) : courses.length === 0 ? (
          <p className="empty-state">No courses added yet. Click "Add Course" above to add one.</p>
        ) : (
          courses.map((course) => (
            <div className="card" key={course.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '4px' }}>{course.name}</h3>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-blue)', background: '#e0e7ff', padding: '3px 8px', borderRadius: '6px' }}>
                      {course.code}
                    </span>
                  </div>
                  {course.duration && (
                    <span className="status-badge active" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={12} /> {course.duration}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-gray)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUserCheck color="var(--primary-blue)" />
                    <strong>Instructor:</strong> {course.instructor || "Not assigned"}
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUsers color="var(--primary-blue)" />
                    <strong>Enrolled:</strong> {course.students || 0} Students
                  </p>
                  {course.fees && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiDollarSign color="var(--primary-blue)" />
                      <strong>Fees:</strong> ₹{Number(course.fees).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="card-footer" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDeleteCourse(course.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FiTrash2 /> Delete Course
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Course Modal */}
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
            <h3 className="modal-title">Add New Course</h3>

            <form onSubmit={handleAddCourse}>
              <div className="input-group">
                <label>Course Title</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Computer Science"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="e.g. CS-101"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 4 Years"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Instructor Name</label>
                  <input
                    type="text"
                    name="instructor"
                    placeholder="e.g. Dr. A. Verma"
                    value={formData.instructor}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label>Course Fees</label>
                  <input
                    type="number"
                    name="fees"
                    placeholder="e.g. 85000"
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Initial Enrolled Students</label>
                <input
                  type="number"
                  name="students"
                  min="0"
                  placeholder="0"
                  value={formData.students}
                  onChange={handleChange}
                />
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
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}