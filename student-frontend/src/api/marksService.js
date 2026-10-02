// src/api/marksService.js

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/marks`;

export const marksService = {
  // GET: /api/marks
  getAllMarks: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch marks:", error);
      return [];
    }
  },

  // POST: /api/marks
  createMarks: async (marksData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marksData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to record marks:", error);
      throw error;
    }
  },

  // DELETE: /api/marks/{id}
  deleteMarks: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to delete marks ID ${id}:`, error);
      throw error;
    }
  },
};