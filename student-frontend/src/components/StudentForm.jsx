import React, { useState, useEffect } from 'react';

export default function StudentForm({ onSubmit, editingStudent, onCancelEdit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    course: '',
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData(editingStudent);
    } else {
      setFormData({ firstName: '', lastName: '', email: '', course: '' });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;
    onSubmit(formData);
  };

  return (
    <form className="student-form-modal" onSubmit={handleSubmit}>
      <h2 className="modal-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
      
      <div className="form-grid">
        <div className="input-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="e.g. First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="e.g. Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            placeholder="e.g. BTeach"
            value={formData.course}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="modal-actions">
        {/* We moved the cancel action to a dedicated button */}
        <button type="button" className="btn-cancel" onClick={onCancelEdit}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {editingStudent ? 'Update Student' : 'Save Student'}
        </button>
      </div>
    </form>
  );
}