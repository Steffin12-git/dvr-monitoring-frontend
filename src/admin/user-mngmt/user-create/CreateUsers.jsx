/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../../../index";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TextField, Button, Box, InputAdornment, Typography, Grid2, MenuItem, useMediaQuery, useTheme, Select, InputLabel } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
        navigate("/admin/users");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      const status = error.response?.status;
      
      if (status === 400) {
        setError("Invalid username or password.");
        toast.error("Invalid username or password!", {
          autoClose: 800,
        });
      } else if (status === 401) {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login");
        setError("Unauthorized. Please log in again.");
        toast.error("Unauthorized. Please log in again!", {
          autoClose: 800,
        });
      } else if (status === 403) {
        setError("Access denied. Only admins can add new users.");
        toast.error("Access denied. Only admins can add new users!", {
          autoClose: 800,
        });
      } else if (status === 409) {
        setError("Username already exists.");
        toast.error("Username already exists!", {
          autoClose: 800,
        });
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later!", {
          autoClose: 800,
        });
      }
      console.error("Error adding user: ", error);
    }
  }

  /**
   * Handles the cancellation of the form, redirecting to the users list.
   */
  function handleCancel() {
    navigate("/admin/users");
  }

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", bgcolor: "#ffffff" }}
    >
      <ToastContainer />
      <Box
        component="form"
        sx={{
          width: isSmallScreen ? "80%" : 400,
          padding: isSmallScreen ? 2 : 4,
          borderRadius: 5,
          boxShadow: 10,
          backgroundColor: "#ffffff",
        }}
        
        onSubmit={handleNewUser}
      >
        <Grid2 container direction="column" spacing={isSmallScreen ? 2 : 3}>
          <Grid2 item textAlign="center">
          <PersonAddIcon 
            sx={{
                fontSize: isSmallScreen ? 40 : 50,
              }}
          />
          <Typography 
            variant={isSmallScreen ? "h6" : "h5"}
            component="h2"
            gutterBottom
            sx={{
              color: "#111111",
              fontWeight: "bold",
            }}
          >
            Add User
          </Typography>
          </Grid2>

          <Grid2 item>
          <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              name="username"
              placeholder="Enter username"
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

          <Grid2 item>
            <TextField
              label='Role'
              variant="outlined"
              fullWidth
              select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem key='admin' value='admin'>Admin</MenuItem>
              <MenuItem key='normal' value='normal'>Normal</MenuItem>
            </TextField>
          </Grid2>

          <Grid2 item>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter password"
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
          <Grid2 item>
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              placeholder="Confirm password"
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

          <Grid2 item container justifyContent="center" spacing={2}>
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
                color="primary"
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
