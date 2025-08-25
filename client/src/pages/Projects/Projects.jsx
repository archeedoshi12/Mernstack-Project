import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import {
  fetchProjects,
  addProject,
  editProject,
  removeProject,
  fetchuserProjects
} from "../../redux/slices/projectSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Projects.css";
import { ToastContainer,Slide } from "react-toastify";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth || {});
  const { users } = useSelector((state) => state.users || {});

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    createdBy: user?._id || "",
    role: "admin",
    team: [{ _id: "", name: "", email: "", role: "member" }],
  });
  const [mode, setMode] = useState("add");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  useEffect(() => {
    if (user.role === "employee") {
      dispatch(fetchuserProjects());
    } else {
      dispatch(fetchProjects());
    }
    dispatch(fetchUsers());
  }, [dispatch, user.role]);
  

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTeamChange = (index, e) => {
    const selectedUser = users.find((u) => u._id === e.target.value);

    if (formData.team.some((m, i) => m._id === selectedUser._id && i !== index)) {
      alert("This user is already added to the team.");
      return;
    }

    const newTeam = [...formData.team];
    newTeam[index] = {
      _id: selectedUser?._id || "",
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      role: "member",
    };
    setFormData({ ...formData, team: newTeam });
  };

  const addTeamMember = () => {
    if (formData.team.length >= 5) {
      alert("You can only add up to 5 team members.");
      return;
    }
    setFormData({
      ...formData,
      team: [...formData.team, { _id: "", name: "", email: "", role: "member" }],
    });
  };

  const removeTeamMember = (index) => {
    const newTeam = formData.team.filter((_, i) => i !== index);
    setFormData({ ...formData, team: newTeam });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      dispatch(addProject(formData));
    } else {
      dispatch(editProject({ id: currentProjectId, updates: formData }));
    }
    setOpenModal(false);
    resetForm();
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      createdBy: project.createdBy?._id || user?._id || "",
      role: project.role || "admin",
      team: project.team?.length
        ? project.team.map((m) => ({
            _id: m._id,
            name: m.name,
            email: m.email,
            role: m.role || "member",
          }))
        : [{ _id: "", name: "", email: "", role: "member" }],
    });
    setCurrentProjectId(project._id);
    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(removeProject(id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      createdBy: user?._id || "",
      role: "admin",
      team: [{ _id: "", name: "", email: "", role: "member" }],
    });
    setMode("add");
    setCurrentProjectId(null);
  };

  const filteredProjects = projects;

  return (
    <div className="users-wrapper">
      <div className="users-container">
          <div className="project-header">
            <h2 className="project-title">Projects</h2>

            {(user.role === "admin" || user.role === "manager") && (
              <button
                className="add-btn"
                onClick={() => {
                  resetForm();
                  setOpenModal(true);
                }}
              >
                + Add Project
              </button>
            )}
          </div>

          {loading && <p>Loading projects...</p>}
          {error && <p className="error">{error}</p>}

          <table className="project-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Description</th>
                <th>Team Size</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>
                    {project.team?.length
                      ? `${project.team.length} Members`
                      : "No Members"}
                  </td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td className="action-icons">
                    {(user.role === "admin" || user.role === "manager") && (
                      <>
                        <FaEdit
                          className="edit-icon"
                          onClick={() => handleEdit(project)}
                        />
                        <FaTrash
                          className="delete-icon"
                          onClick={() => handleDelete(project._id)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{mode === "add" ? "Add Project" : "Edit Project"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <h4>Team Members</h4>
              {formData.team.map((member, index) => (
                <div key={index} className="team-member">
                  <select
                    value={member._id || ""}
                    onChange={(e) => handleTeamChange(index, e)}
                    disabled={user.role === "employee"}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>

                  {formData.team.length > 1 && user.role !== "employee" && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeTeamMember(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              {user.role !== "employee" && formData.team.length < 5 && (
                <button
                  type="button"
                  className="add-btn small"
                  onClick={addTeamMember}
                >
                  + Add Member
                </button>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={user.role === "employee"}
                >
                  {mode === "add" ? "Save" : "Update"}
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
     <ToastContainer
        position="top-right"
        autoClose={2000}
        transition={Slide}
        pauseOnFocusLoss={false}
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default ProjectPage;
