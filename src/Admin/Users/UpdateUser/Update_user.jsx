/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../../../index";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
import addNewUserIcon from "../../../assets/icons/update_user.png";

/**
 * Update_user Component
 * A React component that provides a form to edit user details. It allows an admin to update an existing user's name, role, and password.
 *
 * @component
 */
export default function Update_user() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    role: "",
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

    if (!user.name || user.role === "Select" || !user.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.put(`/users/${id}`, {
        name: user.name,
        role: user.role,
        password: user.password,
      });

      if (response) {
        toast.success("User updates successfully!");
        setTimeout(() => {
          navigate("/usersList");
        }, 500);
      } else {
        setError("Failed to update user. Please try again later.");
        toast.error("Failed to update user. Please try again later.");
      }
    } catch (err) {
      setError("An error occurred. Please try again!");
      toast.error("An error occurred. Please try again!");
      console.error(err);
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

        {/* Role Field */}
        <div className="mb-1">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option>Select</option>
            <option value="admin">Admin</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="form-label">Password</label>
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
              placeholder="Enter password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Buttons */}
        <div className="d-flex justify-content-center " style={{ gap: "40px" }}>
          <button type="submit" className="btn btn-primary w-45">
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
