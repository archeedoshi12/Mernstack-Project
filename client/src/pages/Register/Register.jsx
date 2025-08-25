import React, { useState ,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(register(formData));
      if (resultAction) {
        toast.success(resultAction.payload.message, {
          position: "top-right",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(resultAction.payload || "Registration failed", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", {
        position: "top-right",
      });
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Sign up to get started</p>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="register-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="register-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="register-input"
          />
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="register-footer">
          <span>Already have an account?</span>
          <a href="/login"> Login</a>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        transition={Slide}
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Register;
