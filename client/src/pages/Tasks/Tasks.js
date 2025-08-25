import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
  fetchUserTasks,
} from "../../redux/slices/taskSlice";
import { fetchProjects } from "../../redux/slices/projectSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";
import "./Tasks.css";

const TasksPage = () => {
  const dispatch = useDispatch();

  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: [],
  });
  const [mode, setMode] = useState("add");
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    if (user.role === "employee") {
      dispatch(fetchUserTasks());
    } else {
      dispatch(fetchTasks());
      dispatch(fetchProjects());
      dispatch(fetchUsers());
    }
  }, [dispatch, user.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      dispatch(
        addTask({
          title: formData.title,
          description: formData.description,
          project: formData.projectId,
          assignedTo: formData.assignedTo,
        })
      );
    } else {
      dispatch(
        editTask({
          id: currentTaskId,
          updates: {
            title: formData.title,
            description: formData.description,
            project: formData.projectId,
            assignedTo: formData.assignedTo,
          },
        })
      );
    }
    setOpenModal(false);
    resetForm();
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      projectId: task.project?._id || "",
      assignedTo: task.assignedTo?.map((u) => u._id) || [],
    });
    setCurrentTaskId(task._id);
    setMode("edit");
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(removeTask(id));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectId: "",
      assignedTo: [],
    });
    setMode("add");
    setCurrentTaskId(null);
  };

  return (
    <div className="users-wrapper">
      <div className="users-container">
        <div className="project-header">
          <h2 className="project-title">Tasks</h2>

          {(user.role === "admin" || user.role === "manager") && (
            <button
              className="add-btn"
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
            >
              + Add Task
            </button>
          )}
        </div>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="error">{error}</p>}

        <table className="project-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Created At</th>
              {(user.role === "admin" || user.role === "manager") && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, i) => (
                <tr key={task._id}>
                  <td>{i + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.project ? task.project.name : "-"}</td>
                  <td>
                    {task.assignedTo?.length > 0
                      ? task.assignedTo.map((u) => u.name).join(", ")
                      : "-"}
                  </td>
                  <td>
                    {user.role === "employee" ? (
                      <select
                        value={task.status}
                        onChange={(e) =>
                          dispatch(
                            editTask({
                              id: task._id,
                              updates: { status: e.target.value },
                            })
                          )
                        }
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  {(user.role === "admin" || user.role === "manager") && (
                    <td className="action-icons">
                      <FaEdit
                        className="edit-icon"
                        onClick={() => handleEdit(task)}
                      />
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDelete(task._id)}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{mode === "add" ? "Add Task" : "Edit Task"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Task Description"
                value={formData.description}
                onChange={handleChange}
              />

              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Project --</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))}
              </select>

              <Select
                isMulti
                options={
                  formData.projectId
                    ? projects
                        .find((proj) => proj._id === formData.projectId)
                        ?.team.map((m) => ({
                          value: m._id,
                          label: m.name,
                        })) || []
                    : []
                }
                value={formData.assignedTo.map((id) => {
                  const project = projects.find(
                    (proj) => proj._id === formData.projectId
                  );
                  const member = project?.team.find((m) => m._id === id);
                  return member ? { value: member._id, label: member.name } : null;
                }).filter(Boolean)}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    assignedTo: selected.map((opt) => opt.value),
                  })
                }
                placeholder="Select team members..."
                closeMenuOnSelect={false}
              />

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
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
    </div>
  );
};

export default TasksPage;
