const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { name, description, team } = req.body;
    const project = await Project.create({ name, description, team, createdBy: req.user._id });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "manager") query = { createdBy: req.user._id };
    if (req.user.role === "employee") query = { "team.email": req.user.email };

    const projects = await Project.find(query)
      .populate("team", "name email role")
      .populate("createdBy", "name email role");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (req.user.role !== "admin" && !project.createdBy.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

    const { name, description, team } = req.body;
    if (name) project.name = name;
    if (description) project.description = description;
    if (team) project.team = team;

    await project.save();
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "team.email": req.user.email }).populate("createdBy", "name email role");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (req.user.role !== "admin" && !project.createdBy.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

    await project.deleteOne();
    res.json({ message: "Project deleted successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, updateProject, getUserProjects, deleteProject };
