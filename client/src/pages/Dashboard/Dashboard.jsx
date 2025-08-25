import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChartComponent from "../../components/Chart";
import DashboardCard from "../../components/DashboardCard";
import { fetchProjects } from "../../redux/slices/projectSlice";
import { fetchTasks } from "../../redux/slices/taskSlice";
import { fetchUsers } from "../../redux/slices/userSlice";
import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setChartData({
      labels: ["Projects", "Tasks", "Users"],
      datasets: [
        {
          label: "Count",
          data: [projects.length, tasks.length, users.length],
          borderColor: "#4f63f3",
          backgroundColor: "rgba(79, 99, 243, 0.2)",
          tension: 0.4,
        },
      ],
    });
  }, [projects, tasks, users]);

  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        <DashboardCard
          title="Projects"
          value={projects.length}
          onClick={() => navigate("/projects")}
        />
        <DashboardCard
          title="Tasks"
          value={tasks.length}
          onClick={() => navigate("/tasks")}
        />
        {(user.role === "admin" || user.role === "manager") && (
          <DashboardCard
            title="Users"
            value={users.length}
            onClick={() => navigate("/users")}
          />
        )}
      </div>

      <div className="chart-container">
        <ChartComponent chartData={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
