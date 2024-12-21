/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../index";
import usernames from "../../assets/icons/username.png";
import passwords from "../../assets/icons/password.png";
import addNewUser from "../../assets/icons/add-user-icon.png";

/**
 * Login Component
 *
 * The `Login` component renders a form that allows users to log in by entering their username and password.
 *
 * @component
 *
 */
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles the login form submission.
   *
   * Sends a POST request to the login API endpoint with the username and password.
   * Displays a success or error based on the API response.
   *
   * @param {Event} e - The form submission event.
   * @async
   */
  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post("/login", {
        username: username.trim(),
        password: password.trim(),
      });

      const userDataResponse = await axios.get(
        `/users?name=${username.trim()}&password=${password.trim()}`
      );
      const users = userDataResponse.data;

      if (users.length === 0) {
        throw new Error("Invalid username or password");
      }

      const user = users.find(
        (u) => u.name === username && u.password === password
      );
      if (!user) {
        throw new Error("Invalid username or password");
      }

      toast.success("Login successfull!");

      if (user.role === "admin") {
        navigate("/usersList");
      } else {
        navigate("/devicesList/urlProfiles");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized access. Please check your credentials.");
      } else if (err.response && err.response.status === 404) {
        toast.error("Login endpoint not found. Check your backend route.");
      } else {
        toast.error(err.message || "An error occurred. Please try again.");
      }
    }
  }

  /**
   * Resets the username and password fields.
   * Displays a cancel toast notification.
   */
  function handleCancel() {
    setUsername("");
    setPassword("");
    toast.info("Login canceled.");
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <ToastContainer />
      <form className="bg-white p-5 rounded shadow-sm" onSubmit={handleLogin}>
        <div className="text-center mb-4">
          <img
            src={addNewUser}
            alt="Login Icon"
            className="mb-1"
            style={{ width: "50px", height: "50px" }}
          />
          <h2 className="fw-bold text-dark">Login</h2>
          <div
            className="bg-primary mt-2"
            style={{ height: "2px", marginBottom: "15%" }}
          ></div>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="position-relative mb-4">
            <img
              src={usernames}
              alt="username"
              className="position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ width: "20px", height: "20px" }}
            />
            <input
              id="username"
              type="text"
              className="form-control ps-5"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="position-relative">
            <img
              src={passwords}
              alt="password"
              className="position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ width: "20px", height: "20px" }}
            />
            <input
              id="password"
              type="password"
              className="form-control ps-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        <div className="d-flex justify-content-evenly gap-3 mt-4">
          <button
            type="submit"
            className="btn btn-primary w-48"
            style={{ cursor: "pointer" }}
            disabled={!username || !password}
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-secondary w-48"
            style={{ cursor: "pointer" }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
