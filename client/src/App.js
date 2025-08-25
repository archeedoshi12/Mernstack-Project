import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProjectPage from "./pages/Projects/Projects";
import UsersPage from "./pages/Users/Users";
import TasksPage from "./pages/Tasks/Tasks";
import ProfilePage from "./pages/Profile/Profile";
import DashboardLayout from "./components/Dashboardlayout";
import Loader from "./components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getToken = () => localStorage.getItem("token");
const PrivateRoute = ({ children }) => {
  const token = getToken();
  if (!token) {
    toast.info("Please login to continue", { position: "top-right" });
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const loading = useSelector((state) => state.loader.loading);
  return (
    <>
      {loading && <Loader />}

      <Router>
        <Routes>
          <Route
            path="/"
            element={getToken() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default App;
