const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    let users = [];
    if (req.user.role === "admin") {
      users = await User.find().select("-password");
    } else if (req.user.role === "manager") {
      const projects = await Project.find({ createdBy: req.user._id }, "team");
      const userIds = projects.flatMap(p => p.team);
      users = await User.find({ _id: { $in: userIds } }).select("-password");
    } else if (req.user.role === "employee") {
      const projects = await Project.find({ team: req.user._id }, "team");
      const userIds = projects.flatMap(p => p.team);
      users = await User.find({ _id: { $in: userIds } }).select("-password");
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ "team.email": req.user.email });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password?.trim()) user.password = await bcrypt.hash(password, 10);

    await user.save();
    const { password: _, ...userData } = user.toObject();
    res.json({ message: "User updated successfully", user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || "employee",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserProjects,
  updateUserRole,
  addUser,
  deleteUser,
  getuser,
};
