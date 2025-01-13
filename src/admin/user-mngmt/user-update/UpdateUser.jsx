/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "../../../index";
import usernameIcon from "../../../assets/icons/username.png";
import passwordIcon from "../../../assets/icons/password.png";
//import addNewUserIcon from "../../../assets/icons/update_user-icon2.png";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
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
          navigate("/admin/users");
        }, 800);
      } else {
        setError("Failed to update user. Please try again later.");
        toast.error("Failed to update user. Please try again later.");
      }
    } catch (err) {
      const status = err.response?.status;
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
        setError("Access denied. User lacks permission.");
        toast.error("Access denied. User lacks permission!", {
          autoClose: 800,
        });
      } else if (status === 404) {
        setError("User ID does not exist.");
        toast.error("User ID does not exist!", {
          autoClose: 800,
        });
      } else if (status === 409) {
        setError("Updated username conflicts with an existing username.");
        toast.error("Updated username conflicts with an existing username!", {
          autoClose: 800,
        });
      } else {
        setError("An error occurred. Please try again!");
        toast.error("An error occurred. Please try again!", {
          autoClose: 800,
        });
      }
    }
  }

  /**
   * Handles the cancellation of the form, redirecting to the users list.
   */
  function handleCancel() {
    navigate("/admin/users");
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
      sx={{ minHeight: "100vh", bgcolor: "#ffffff",  padding: isSmallScreen ? 2 : 4, }}
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
        onSubmit={handleSubmit}
      >
        <Grid2 container direction="column" spacing={isSmallScreen ? 2 : 3}>
          <Grid2 item textAlign="center">
          <ManageAccountsIcon 
            sx={{
                fontSize: isSmallScreen ? 40 : 50,
              }}
          />
          
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
          <Grid2 item xs={12} mb={2}>
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              select
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
              placeholder="Enter password"
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
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Update
              </Button>
            </Grid2>
            <Grid2 item>
              <Button variant="outlined" color="primary" fullWidth onClick={handleCancel}>
                Cancel
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Grid2>
  );
}
