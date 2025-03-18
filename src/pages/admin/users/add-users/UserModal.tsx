import React, { JSX, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { AxiosError } from "axios";
import axios from "../../../../main"


/**
 * Props for the UserModal component.
 */
interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}


/**
 * UserModal component for adding a new user.
 *
 * @component
 * @param {UserModalProps} props - Component props
 * @returns {JSX.Element} The rendered UserModal component.
 */
const UserModal: React.FC<UserModalProps> = ({ open, onClose, onUserAdded }: UserModalProps): JSX.Element => {
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("normal");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); 


  /**
   * Handles adding a new user.
   * Validates input fields and sends a request to the API.
   * Displays error messages if validation fails or request encounters an error.
   */
  const handleAddUser = async () => {
    setError("");

    if (!username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (username.length < 4 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username must be 4-20 characters (letters, numbers, underscores only).");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("/users", { username, role, password }, { withCredentials: true });
      
      setSnackbarOpen(true); 
      onUserAdded(); 
      handleClose();
    } catch (err) {
      const errorResponse = (err as AxiosError).response;

      if (errorResponse) {
        switch (errorResponse.status) {
          case 400:
            setError("Invalid username or password.");
            break;
          case 401:
            setError("Unauthorized. Please log in.");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            break;
          case 403:
            setError("Permission denied. Admin access required.");
            break;
          case 409:
            setError("Username already exists.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Network error. Check your connection.");
      }
    }
  };


  /**
   * Closes the modal and resets the form fields.
   */
  const handleClose = () => {
    onClose();
    resetForm();
  };


  /**
   * Resets all form input fields and error messages.
   */
  const resetForm = () => {
    setUsername("");
    setRole("normal");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "#d8d8e1",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
            outline: "none",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 7 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.5, textAlign: "center" }}>
              ADD USER
            </Typography>
          </Box>

          <Box component="form" sx={{ display: "grid", gap: 2 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddUser}
                sx={{
                  borderRadius: "8px",
                  py: 1,
                  backgroundColor: "#2d3b63",
                  "&:hover": { backgroundColor: "#1a243d" },
                }}
              >
                Add
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderRadius: "8px",
                  py: 1,
                  color: "#2d3b63",
                  borderColor: "#2d3b63",
                  "&:hover": {
                    borderColor: "#1a243d",
                    backgroundColor: "rgba(45, 59, 99, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Successfully added a new user!
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserModal;
