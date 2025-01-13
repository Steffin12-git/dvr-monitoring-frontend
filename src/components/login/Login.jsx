import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../index";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography,
  Grid2,
} from "@mui/material";
import usernames from "../../assets/icons/username.png";
import passwords from "../../assets/icons/password.png";
import addNewUser from "../../assets/icons/loginpng.png";

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

  const isLoggedIn = !!localStorage.getItem("role");

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
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
  
    if (username.trim().length < 4) {
      toast.error("Username must be at least 4 characters.");
      return;
    }
    if (password.trim().length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
  
    try {
      const response = await axios.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });
  
      const user = response.data;
  
      if (user && user.username === username && user.role && user.id) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.id);
  
        toast.success("Login successful!", {
          autoClose: 800,
        });
  
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        toast.error("Invalid username or password", {
          autoClose: 800,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
  
      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized access. Please check your credentials.", {
          autoClose: 800,
        });
      } else if (err.response && err.response.status === 404) {
        toast.error("Login endpoint not found. Check your backend route.", {
          autoClose: 800,
        });
      } else {
        toast.error(err.message || "An error occurred. Please try again.", {
          autoClose: 800,
        });
      }
    }
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
          width: 400,
          padding: 4,
          borderRadius: 5,
          boxShadow: 10,
          backgroundColor: "#ffffff",
        }}
        onSubmit={handleLogin}
      >
        <Grid2 container direction="column" alignItems="center">
          <Grid2 item>
            <img
              src={addNewUser}
              alt="Login Icon"
              className="mb-3"
              sx={{ maxWidth: "10px", maxHeight: "10px" }}
            />
          </Grid2>
          <Grid2 item>
            <Typography variant="h5" component="h2" gutterBottom>
              Login
            </Typography>
          </Grid2>
          <Grid2 item xs={12} mb={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={usernames}
                      alt="username"
                      style={{ maxWidth: "20px", maxHeight: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item md={12} mb={3}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={passwords}
                      alt="password"
                      style={{ maxWidth: "20px", maxHeight: "20px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item container justifyContent="center" spacing={2}>
            <Grid2 item >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!username || !password}
                sx={{width:100}}
              >
                Login
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Grid2>
  );
}
