import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const sidebarTitle = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

      {/* Profile & Logout */}
      <div className="sidebar-divider"></div>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "sidebar-item active" : "sidebar-item"
        }
      >
        <FaUserCircle style={{ marginRight: "8px" }} />
        Profile
      </NavLink>

      <button className="sidebar-item logout-btn" onClick={handleLogout}>
        <FaSignOutAlt style={{ marginRight: "8px" }} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
