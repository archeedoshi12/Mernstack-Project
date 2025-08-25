import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, updateUserRole, deleteUser } from "../../redux/slices/userSlice";
import { fetchProjects } from "../../redux/slices/projectSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
  }, [dispatch]);

  const openAddModal = () => {
    setMode("add");
    setFormData({ name: "", email: "", password: "", role: "employee" });
    setOpenModal(true);
  };

  const openEditModal = (user) => {
    setMode("edit");
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
    setCurrentUserId(user._id);
    setOpenModal(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        await dispatch(addUser(formData)).unwrap();
        toast.success("User added successfully");
      } else {
        await dispatch(
          updateUserRole({
            userId: currentUserId,
            updatedData: {
              name: formData.name,
              email: formData.email,
              role: formData.role,
              password: formData.password || "",
            },
          })
        ).unwrap();
        toast.success("User updated successfully");
      }
      setOpenModal(false);
    } catch (err) {
      toast.error("Operation failed: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error("Failed to delete user: " + err.message);
      }
    }
  };

  const getUserProjects = (userId) => {
    return projects.filter((project) =>
      project.team?.some((member) => member._id === userId)
    );
  };

  return (
    <div className="users-wrapper">
      <div className="users-container">
        <div className="users-main">
          <div className="users-header">
            <h2 className="users-title">Users</h2>
            {currentUser?.role !== "employee" && (
              <button className="add-btn" onClick={openAddModal}>
                + Add User
              </button>
            )}
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Projects</th>
                {currentUser?.role !== "employee" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentUser.role === "employee" ? (
                <tr key={currentUser._id}>
                  <td>1</td>
                  <td>{currentUser.name}</td>
                  <td>{currentUser.email}</td>
                  <td>{currentUser.role}</td>
                  <td>{new Date(currentUser.createdAt).toLocaleDateString()}</td>
                  <td>
                    {getUserProjects(currentUser._id).length > 0
                      ? getUserProjects(currentUser._id).map((p) => p.name).join(", ")
                      : "No projects"}
                  </td>
                </tr>
              ) : (
                users
                  .filter((user) => user._id !== currentUser._id) // exclude logged-in user
                  .map((user, index) => {
                    const userProjects = getUserProjects(user._id);
                    return (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          {userProjects.length > 0
                            ? userProjects.map((p) => p.name).join(", ")
                            : "No projects"}
                        </td>
                        <td className="action-icons">
                          <FaEdit className="edit-icon" onClick={() => openEditModal(user)} />
                          <FaTrash className="delete-icon" onClick={() => handleDelete(user._id)} />
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>

          </table>
        </div>
      </div>


      {openModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{mode === "add" ? "Add User" : "Edit User"}</h3>
            <form onSubmit={handleSubmit} className="modal-form" autoComplete="off">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="modal-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="modal-input"
                required
              />
              <input
                type="password"
                name="password"
                placeholder={mode === "add" ? "Password" : "New Password (optional)"}
                value={formData.password}
                onChange={handleChange}
                className="modal-input"
                {...(mode === "add" ? { required: true } : {})}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="modal-input"
                required
                disabled={currentUser.role !== "admin"}
              >
                <option v Projectsalue="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {mode === "add" ? "Add User" : "Update User"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default UsersPage;
