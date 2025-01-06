/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../../../index";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
import addNewUserIcon from "../../../assets/icons/update_user-icon2.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { TextField, Button, Box, InputAdornment, Typography, Grid2, useTheme, useMediaQuery } from "@mui/material";

/**
 * Update User Component
 *
 * Provides a user interface for admins to update an existing user's details, such as username, role, and password.
 * Utilizes form inputs and validates user input before sending it to the server.
 *
 * @component
 */

export default function Update_user() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
    const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState({
    username: location.state?.username || "", 
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

    const { username, role, password } = user;

    if (!username || !role) {
      toast.error("Username and Role are required!");
      return;
    }

    if (username.length < 4) {
      toast.error("Username must be at least 4 characters long!");
      return;
    }

    const validRoles = ["normal", "admin"];
    if (!validRoles.includes(role.toLowerCase())) {
      toast.error("Invalid role selected!");
      return;
    }

    try {
      const updatedData = {
        username: username.trim(),
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

  /**
   * Handles the cancellation of the form, redirecting to the users list.
   */
  function handleCancel() {
    navigate("/usersList");
  }

  /**
   * Handles input changes for the form fields.
   *
   * @param {Event} e - The input change event.
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", bgcolor: "#e0e0e0",  padding: isSmallScreen ? 2 : 4, }}
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
        onSubmit={handleSubmit}
      >
        <Grid2 container direction="column" alignItems="center">
          <Grid2 item>
            <img
              src={addNewUserIcon}
              alt="Add New User Icon"
              sx={{ maxWidth: "50px", maxHeight: "50px" }}
            />
          </Grid2>
          <Grid2 item mb={2}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#111111", fontWeight: "bold" }}>
              Update User
            </Typography>
          </Grid2>
          <Grid2 item xs={12} mb={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={user.username}
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
              sx={{ width: 240 }}
              name="role"
              value={user.role}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
              required
            >
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
              value={user.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter your password"
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
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Update
              </Button>
            </Grid2>
            <Grid2 item>
              <Button variant="outlined" color="secondary" fullWidth onClick={handleCancel}>
                Cancel
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Grid2>
  );
}
