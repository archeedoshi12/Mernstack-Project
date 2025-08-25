import axios from "axios";
import { showLoader, hideLoader } from "../redux/slices/loaderSlice";

let reduxStore;
export const injectStore = (store) => {
  reduxStore = store;
};

const api = axios.create({
  baseURL: "https://mernstack-1-0tp6.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    if (reduxStore) reduxStore.dispatch(showLoader());
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => {
    if (reduxStore) reduxStore.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (reduxStore) reduxStore.dispatch(hideLoader());
    return response;
  },
  (error) => {
    if (reduxStore) reduxStore.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

export default api;
