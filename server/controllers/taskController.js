const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res) => {
  try {
    const { title, description, project, projectId, assignedTo = [] } = req.body;
    const projectRef = project || projectId;

    if (!projectRef) return res.status(400).json({ message: "project is required" });
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const proj = await Project.findById(projectRef);
    if (!proj) return res.status(404).json({ message: "Project not found" });

    const teamIds = (proj.team || []).map((m) => (m._id ? m._id.toString() : m.toString()));
    if (assignedTo.length) {
      const bad = assignedTo.find((u) => !teamIds.includes(u.toString()));
      if (bad) return res.status(400).json({ message: "Assigned users must be in project team" });
    }

    const task = await Task.create({
      title,
      description,
      project: projectRef,
      assignedTo,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate("project", "title name")
      .populate("assignedTo", "name");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "manager") {
      const projects = await Project.find({ manager: req.user._id }).select("_id");
      query.project = { $in: projects.map((p) => p._id) };
    } else if (req.user.role === "employee") {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate("project", "title name")
      .populate("assignedTo", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, project, projectId, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssignee =
      Array.isArray(task.assignedTo) &&
      task.assignedTo.some((id) => id.toString() === req.user._id.toString());

    if (req.user.role === "employee") {
      if (!isAssignee) return res.status(403).json({ message: "Forbidden" });
      if (status !== undefined) task.status = status;
      await task.save();
      const populated = await Task.findById(task._id)
        .populate("project", "title name")
        .populate("assignedTo", "name");
      return res.json(populated);
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const newProject = project || projectId;
    if (newProject) {
      const proj = await Project.findById(newProject);
      if (!proj) return res.status(404).json({ message: "Project not found" });
      task.project = newProject;

      if (Array.isArray(assignedTo)) {
        const teamIds = (proj.team || []).map((m) =>
          m._id ? m._id.toString() : m.toString()
        );
        const bad = assignedTo.find((u) => !teamIds.includes(u.toString()));
        if (bad) {
          return res
            .status(400)
            .json({ message: "Assigned users must be in project team" });
        }
      }
    }

    if (Array.isArray(assignedTo)) task.assignedTo = assignedTo;
    await task.save();
    const populated = await Task.findById(task._id)
      .populate("project", "title name")
      .populate("assignedTo", "name");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    console.log(req.user._id);

    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("project", "title name")
      .populate("assignedTo", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createTask, getTasks, updateTask, deleteTask, getMyTasks };
