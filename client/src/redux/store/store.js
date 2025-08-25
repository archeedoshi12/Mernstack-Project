import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import projectReducer from "../slices/projectSlice";
import taskReducer from "../slices/taskSlice";
import userReducer from "../slices/userSlice";
import loaderReducer from "../slices/loaderSlice";
import { injectStore } from "../../utils/axiosConfig";
const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    users: userReducer,
    loader: loaderReducer,
  },
});

injectStore(store);

export default store;
