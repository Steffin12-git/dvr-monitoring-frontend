/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../../index";
import { ToastContainer, toast } from "react-toastify";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
import addNewUserIcon from "../../../assets/icons/update_user.png";

/**
 * Update_user Component
 * A React component to edit user details.
 */
export default function Update_user() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [user, setUser] = useState({
    name: location.state?.name || "", 
    role: location.state?.role || "", 
    password: "",
  });
  const [error, setError] = useState("");

  /**
   * Handles form submission for updating a user.
   *
   * @param {Event} e - The form submission event.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
  
    const { name, role, password } = user;
  
    if (!name || !role) {
      toast.error("Name and Role are required!");
      return;
    }
  
    if (name.length < 4) {
      toast.error("Name must be at least 4 characters long!");
      return;
    }
  
    const validRoles = ["normal", "admin"];
    if (!validRoles.includes(role.toLowerCase())) {
      toast.error("Invalid role selected!");
      return;
    }
  
    try {
      const updatedData = {
        name: name.trim(),
        role: role.toLowerCase(),
      };
  
      if (password.trim()) {
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters long!");
          return;
        }
        updatedData.password = password.trim();
      }
  
      const response = await axios.put(`/users/${id}`, updatedData);
  
      if (response && response.data) {
        toast.success("User updated successfully!");
        setTimeout(() => {
          navigate("/usersList");
        }, 600);
      } else {
        setError("Failed to update user. Please try again later.");
        toast.error("Failed to update user. Please try again later.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again!");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <form
        className="card p-4 shadow-sm"
        style={{ width: "400px" }}
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-2">
          <img
            src={addNewUserIcon}
            alt="icon"
            style={{ width: "50px", height: "50px" }}
          />
          <h4 className="mt-2">Edit User</h4>
          <hr />
        </div>

        <div className="mb-1">
          <label className="form-label">Username</label>
          <div className="input-group">
            <span className="input-group-text">
              <img
                src={usernameIcon}
                alt="username"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-1">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="">Select</option>
            <option value="admin">Admin</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="form-label">Password (Optional)</label>
          <div className="input-group">
            <span className="input-group-text">
              <img
                src={passwordIcon}
                alt="password"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary w-45"
            onClick={() => navigate("/usersList")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
