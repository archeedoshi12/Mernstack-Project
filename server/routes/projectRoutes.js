const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createProject, getProjects, updateProject, deleteProject,getUserProjects } = require("../controllers/projectController");

router.post("/", protect, authorize("admin", "manager"), createProject);
router.put("/:id", protect, authorize("admin", "manager"), updateProject);
router.delete("/:id", protect, authorize("admin", "manager"), deleteProject);
router.get("/", protect, authorize("admin", "manager", "employee"), getProjects);
router.get("/getUserProjects", protect, authorize("admin", "manager", "employee"), getUserProjects);


module.exports = router;
