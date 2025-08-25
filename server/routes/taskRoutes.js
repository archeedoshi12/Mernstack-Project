const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createTask, getTasks, updateTask,deleteTask,getMyTasks } = require("../controllers/taskController");

router.get("/", protect, getTasks);


router.post("/", protect, authorize("admin", "manager"), createTask);

router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/usertasks", protect, authorize("admin", "manager", "employee"), getMyTasks);

module.exports = router;
