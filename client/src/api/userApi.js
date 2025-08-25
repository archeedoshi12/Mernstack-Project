import api from "./api";

const API_URL = "/admin/api/users";

export const getUsers = async () => await api.get(API_URL);
export const addUserApi = async (userData) => await api.post(API_URL, userData);
export const updateUserRoleApi = (userId, updatedData) => {
  return api.put(`/admin/api/users/${userId}`, updatedData);
};
export const deleteUserApi = async (userId) => {
  return await api.delete(`${API_URL}/${userId}`);
};