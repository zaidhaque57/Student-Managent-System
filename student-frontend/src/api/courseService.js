// src/api/courseService.js

const API_BASE_URL = '/api/courses';

export const courseService = {
  // GET: /api/courses
  getAllCourses: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to load courses:", error);
      return [];
    }
  },

  // POST: /api/courses
  createCourse: async (courseData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to create course:", error);
      throw error;
    }
  },

  // DELETE: /api/courses/{id}
  deleteCourse: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to delete course with ID ${id}:`, error);
      throw error;
    }
  },
};