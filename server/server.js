require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const projectRoute = require("./routes/projectRoutes");
const taskRoute = require("./routes/taskRoutes");
const userRoleRoute = require("./routes/userRoutes");
const app = express();
connectDB();

app.use(express.json());
app.use(cors({
    origin: '*',       
    credentials: true,
  }));

app.use("/api/auth", authRoute);
app.use("/admin/api/projects", projectRoute);
app.use("/admin/api/tasks", taskRoute);
app.use("/admin/api/users", userRoleRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
