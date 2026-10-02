// src/api/studentService.js

// Using relative path routed through Vite's dev proxy to port 8080
const API_BASE_URL = '/api/students';

export const studentService = {
  // GET: /api/students
  getAllStudents: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  // POST: /api/students
  createStudent: async (studentData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  // PUT: /api/students/{id}
  updateStudent: async (id, studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating student ID ${id}:`, error);
      throw error;
    }
  },

  // DELETE: /api/students/{id}
  deleteStudent: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting student ID ${id}:`, error);
      throw error;
    }
  },
};