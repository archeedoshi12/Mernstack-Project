import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import "./Profile.css";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/api/users/getUserById");
      setProfile(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-wrapper">
      <div className="profile-main">
        <div className="profile-header">
          <h2 className="profile-title">My Profile</h2>
        </div>

        {loading && <p className="loading">Loading profile...</p>}
        {error && <p className="error">{error}</p>}

        {profile && (
          <table className="profile-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{profile.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{profile.email}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>{profile.role}</td>
              </tr>
              <tr>
                <th>Joined</th>
                <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
