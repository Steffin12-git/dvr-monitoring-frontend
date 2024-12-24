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
 * Provides a user interface for admins to add new users by providing their name, role, and password details.
 * Utilizes form inputs and validates user input before sending it to the server.
 *
 * @component
 */

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
   * Handles the submission of the form to add a new user.
   *
   * @param {Event} e - The form submission event.
   */
  async function handleNewUser(e) {
    e.preventDefault();
    setError("");

    const { name, role, password, confirmPassword } = formData;

    if (!name || role === "Select" ) {
      setError("All fields are required.");
      toast.error("name and role are required!",{
        autoClose: 500,
      });
      return;
    }

    if (name.length < 4) {
      setError("Name must be at least 4 characters.");
      toast.error("Name must be at least 4 characters!",{
        autoClose: 500,
      });
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters!",{
        autoClose: 500,
      });
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match!",{
        autoClose: 500,
      });
      return;
    }

    const validRoles = ["normal", "admin"];
    if (!validRoles.includes(role.toLowerCase())) {
      setError("Invalid role selected.");
      toast.error("Invalid role selected!",{
        autoClose: 500,
      });
      return;
    }

    try {
      const response = await axios.post("/users", {
        name: name.trim(),
        role: role.toLowerCase(),
        password: password.trim(),
      });

      if (response && response.data) {
        const newUser = response.data;
        toast.success("User added successfully!",{
          autoClose: 500,
        });
        navigate("/usersList");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        toast.error("Unauthorized. Please log in again!",{
          autoClose: 500,
        });
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("Access denied. Only admins can add new users.");
        toast.error("Access denied. Only admins can add new users!",{
          autoClose: 500,
        });
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later!",{
          autoClose: 500,
        });
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
        style={{ width: "400px" }}
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
          <label className="form-label">Name</label>
          <div className="input-group mb-1">
            <span className="input-group-text" id="name-addon">
              <img
                src={usernameIcon}
                alt="username"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-describedby="name-addon"
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
              <option value="admin">Admin</option>
              <option value="normal">Normal</option>
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
        <div className="d-flex justify-content-end mt-4 gap-2">
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
