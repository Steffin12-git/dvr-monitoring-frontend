/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../../../index";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
import addNewUserIcon from "../../../assets/icons/add-user-2-icon.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { TextField, Button, Box, InputAdornment, Typography, Grid2, MenuItem } from "@mui/material";

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
   * Handles the submission of the form to add a new user.
   *
   * @param {Event} e - The form submission event.
   */
  async function handleNewUser(e) {
    e.preventDefault();
    setError("");

    const { username, role, password, confirmPassword } = formData;

    if (!username || role === "Select") {
      setError("All fields are required.");
      toast.error("Username and role are required!", {
        autoClose: 500,
      });
      return;
    }

    if (username.length < 4) {
      setError("Username must be at least 4 characters.");
      toast.error("Username must be at least 4 characters!", {
        autoClose: 500,
      });
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters!", {
        autoClose: 500,
      });
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match!", {
        autoClose: 500,
      });
      return;
    }

    const validRoles = ["normal", "admin"];
    if (!validRoles.includes(role.toLowerCase())) {
      setError("Invalid role selected.");
      toast.error("Invalid role selected!", {
        autoClose: 500,
      });
      return;
    }

    try {
      const response = await axios.post("/users", {
        username: username.trim(),
        role: role.toLowerCase(),
        password: password.trim(),
      });

      if (response && response.data) {
        toast.success("User added successfully!", {
          autoClose: 500,
        });
        navigate("/usersList");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        toast.error("Unauthorized. Please log in again!", {
          autoClose: 800,
        });
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("Access denied. Only admins can add new users.");
        toast.error("Access denied. Only admins can add new users!", {
          autoClose: 800,
        });
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later!", {
          autoClose: 800,
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
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", bgcolor: "#e0e0e0" }}
    >
      <ToastContainer />
      <Box
        component="form"
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 5,
          boxShadow: 10,
          backgroundColor: "#ffffff",
        }}
        onSubmit={handleNewUser}
      >
        <Grid2 container direction="column" alignItems="center">
          <Grid2 item>
            <img
              src={addNewUserIcon}
              alt="Add New User Icon"
              className="mb-3"
              sx={{ maxWidth: "50px", maxHeight: "50px" }}
            />
          </Grid2>
          <Grid2 item>
            <Typography variant="h5" component="h2" gutterBottom>
              Add New User
            </Typography>
          </Grid2>
          <Grid2 item xs={12} mb={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              name="username"
              placeholder="Enter your username"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={usernameIcon}
                      alt="username"
                      style={{ maxWidth: "20px", maxHeight: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item xs={12} mb={2}>
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              select  
              sx={{width :240}}
              name="role"
              value={formData.role}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
              required
            >
              <option value="Select">Select</option>
              <option value="admin">Admin</option>
              <option value="normal">Normal</option>
            </TextField>
          </Grid2>
          <Grid2 item xs={12} mb={2}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter your password"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={passwordIcon}
                      alt="password"
                      style={{ maxWidth: "20px", maxHeight: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item xs={12} mb={3}>
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={passwordIcon}
                      alt="password"
                      style={{ maxWidth: "20px", maxHeight: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item container justifyContent="space-between" spacing={2}>
            <Grid2 item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add User
              </Button>
            </Grid2>
            <Grid2 item>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Grid2>
  );
}
