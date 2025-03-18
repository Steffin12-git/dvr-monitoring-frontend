import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "../../main";
import { useNavigate } from "react-router-dom";



/**
 * Interface for the login form state.
 */
interface LoginFormState {
  username: string;
  password: string;
}


/**
 * LoginPage component which provides a user authentication form.
 * 
 * Users can enter their username and password to log in. The component 
 * also includes validation, error handling, and API integration using Axios.
 * 
 * @component
 */
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();



  /**
   * Handles input changes in the login form.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };




  /**
   * Handles form submission for login.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username && !formData.password) {
      setError("Please provide both username and password");
      return;
    }
    if (!formData.username) {
      setError("Please provide username");
      return;
    }
    if (!formData.password) {
      setError("Please provide password");
      return;
    }

    try {
      const response = await axios.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      setError("");

      const { id, username, role } = response.data;
      localStorage.setItem("userId", id);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Invalid credentials");
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    }
  };



  /**
   * Toggles the password visibility in the password input field.
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev: boolean) => !prev);
  };



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        background: "linear-gradient(to right, #FD6585, #0D25B9)",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Image */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, md: 4 },
        }}
      >
        <img
          src="/src/assets/login-image.png"
          alt="Login Illustration"
          style={{
            maxWidth: "80%",
            height: "auto",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.2))",
          }}
        />
      </Box>

      {/* Right Side - Form */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 3, md: 10 },
        }}
      >
        <Box
          p={5}
          boxShadow={24}
          borderRadius={4}
          bgcolor="rgba(255, 255, 255, 0.95)"
          sx={{
            width: "100%",
            maxWidth: "450px",
            height: "auto",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "#2d3748",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              mb: 4,
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "60px",
                height: "4px",
                background: "#3e4d78",
                margin: "16px auto 0",
                borderRadius: 2,
              },
            }}
          >
            Welcome Back
            <Typography
              variant="body1"
              sx={{ mt: 1, color: "#718096", fontSize: "1rem" }}
            >
              Please login to continue
            </Typography>
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              type="text"
              name="username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ color: "#3e4d78" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EnhancedEncryptionIcon sx={{ color: "#3e4d78" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: "#3e4d78" }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Box mt={1} display="flex" alignItems="center">
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ color: "#c53030" }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button type="submit" variant="contained" sx={{ bgcolor: "#3e4d78" }}>
                Sign In
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
