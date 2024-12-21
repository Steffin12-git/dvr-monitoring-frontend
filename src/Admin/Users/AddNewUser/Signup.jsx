/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../../../index";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
import addNewUserIcon from "../../../assets/icons/add-user-icon.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

/**
 * Signup Component
 *
 * Provides a user interface for admins to add new users by providing their username, role, and password details.
 * Utilizes form inputs and validates user input before sending it to the server.
 *
 * @component
 */

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    role: "Select",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  /**
   * Handles input change for all fields.
   *
   * @param {Event} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Retrieves the role from the cookie.
   *
   * @returns {Object|null} - The parsed user role if valid, otherwise null.
   */
  /**
   * Handles the submission of the form to add a new user.
   *
   * @param {Event} e - The form submission event.
   */
  async function handleNewUser(e) {
    e.preventDefault();
    setError("");

    const { username, role, password, confirmPassword } = formData;

    if (
      !username ||
      role === "Select" ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required.");
      toast.error("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/users", {
        name: username.trim(),
        role: role,
        password: password.trim(),
      });
      if (response) {
        const newUser = await response.data;
        toast.success("User added successfully!");
        console.log("User added successfully:", newUser);
        navigate("/usersList");
      } else {
        toast.error("error occured during th process");
        console.log("error occured during th process");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError("Unauthorized. Please log in again.");
        toast.error("Unauthorized. Please log in again!");
        navigate("/l");
      } else if (error.response.status === 403) {
        setError("Access denied. Only admins can add new users.");
        toast.error("Access denied. Only admins can add new users!");
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later!");
      }
    }
  }

  /**
   * Handles the cancellation of the form, redirecting to the users list.
   */
  function handleCancel() {
    navigate("/usersList");
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <form
        className="card p-4 shadow-sm"
        style={{ width: "350px" }}
        onSubmit={handleNewUser}
      >
        <div className="text-center mb-2">
          <img
            src={addNewUserIcon}
            alt="icon"
            style={{ width: "40px", height: "40px" }}
          />
          <h4 className="mt-2">Add New User</h4>
          <hr className="text-primary" />
        </div>
        <div className="mb-0">
          <label className="form-label">Username</label>
          <div className="input-group mb-1">
            <span className="input-group-text" id="username-addon">
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
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-describedby="username-addon"
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option>Select</option>
              <option value="Admin">Admin</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Password</label>
            <div className="input-group mb-0">
              <span className="input-group-text" id="password-addon">
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-describedby="password-addon"
              />
            </div>
          </div>
          <label className="form-label">Confirm Password</label>
          <div className="input-group mb-3">
            <span className="input-group-text" id="confirm-password-addon">
              <img
                src={passwordIcon}
                alt="confirmPassword"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-describedby="confirm-password-addon"
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary w-45">
            ADD
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary w-45"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
