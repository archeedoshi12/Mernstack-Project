const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  getAllUsers,
  updateUserRole,
  addUser,
  deleteUser,
  getUserProjects,
  getuser
} = require("../controllers/userController");


router.get("/", protect, authorize("admin", "manager"), getAllUsers);
router.post("/", protect, authorize("admin"), addUser);
router.put("/:id", protect, authorize("admin"), updateUserRole);
router.get("/getUserById", protect, getuser); 
router.get("/projects", protect, authorize("employee", "manager", "admin"), getUserProjects);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
