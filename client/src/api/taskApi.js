import api from "./api";

const API_URL = "/admin/api/tasks";

export const getTasks = async () => {
  const response = await api.get(API_URL);
  return response;
};

export const createTask = async (taskData) => {
  const response = await api.post(API_URL, taskData);
  return response;
};

export const updateTask = async (id, updates) => {
  const response = await api.put(`${API_URL}/${id}`, updates);
  return response;
};


export const deleteTask = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response;
};

export const getUserTasks = async () => {
  const response = await api.get("/admin/api/tasks/usertasks");
  return response;
};