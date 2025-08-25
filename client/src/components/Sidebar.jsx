
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const sidebarTitle = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">{sidebarTitle}</h2>
      </div>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "sidebar-item active" : "sidebar-item"
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/projects"
        className={({ isActive }) =>
          isActive ? "sidebar-item active" : "sidebar-item"
        }
      >
        Projects
      </NavLink>

      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          isActive ? "sidebar-item active" : "sidebar-item"
        }
      >
        Tasks
      </NavLink>

      {(user?.role === "admin" || user?.role === "manager") && (
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          Users
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;
