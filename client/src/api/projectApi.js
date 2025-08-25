import api from "./api";

const API_URL = "http://localhost:5000/admin/api/projects";

export const getProjects = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post(API_URL, projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, updates) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const getMyProjects = async () => {
  try {
    const response = await api.get(`${API_URL}/getUserProjects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};