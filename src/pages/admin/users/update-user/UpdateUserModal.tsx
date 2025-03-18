import React, { JSX, useEffect, useState } from "react";
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
import axios from "../../../../main";
import { useNavigate } from "react-router-dom";


/**
 * Props for the UpdateUserModal component.
 */
interface UpdateUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  initialUsername: string;
  initialRole: string;
  onUserUpdated: () => void;
}


/**
 * UpdateUserModal component allows updating user details, including username, role, and password.
 *
 * @component
 * @param {UpdateUserModalProps} props - The component props.
 * @returns {JSX.Element} The rendered UpdateUserModal component.
 */
const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  open,
  onClose,
  userId,
  initialUsername,
  initialRole,
  onUserUpdated,
}: UpdateUserModalProps): JSX.Element => {
  const [username, setUsername] = useState(initialUsername);
  const [role, setRole] = useState(initialRole);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
      open: false,
      message: "",
      severity: "success",
    });
  

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setUsername(initialUsername);
      setRole(initialRole);
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open, initialUsername, initialRole]);


  
  /**
   * Handles the user update process.
   * Performs validation, sends a request to update the user, and handles API responses.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleUpdateUser = async (): Promise<void> => {
    setError("");
    setLoading(true);
  
    if (!username) {
      setError("Username cannot be empty.");
      setLoading(false);
      return;
    }
  
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    try {
      await axios.put(
        `/users/${userId}`,
        { username, role, password: password || undefined },
        { withCredentials: true }
      );
      setSnackbar({ open: true, message: "User updated successfully!", severity: "success" });
      onUserUpdated();
      setLoading(false);
      onClose();      
    } 
    catch (err) {
      setLoading(false);
    
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
    
        switch (status) {
          case 400:
            setError("Invalid user data.");
            break;
          case 401:
            setError("Unauthorized. Please log in.");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login", { replace: true });
            break;
          case 403:
            setError("Permission denied. Admin access required.");
            break;
          case 404:
            setError("User not found.");
            break;
          case 409:
            setError("Username already exists.");
            break;
          default:
            setError("An unexpected error occurred.");
        }
      } else {
        setError("A network error occurred.");
      }
    }
    
  };
  

  return (
    <>
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
          Update User
        </Typography>

        <Box component="form" sx={{ display: "grid", gap: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
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
            label="New Password (Optional)"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
          />

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleUpdateUser}
              disabled={loading}
              sx={{
                borderRadius: "8px",
                py: 1,
                backgroundColor: "#2d3b63",
                "&:hover": {
                  backgroundColor: "#1a243d",
                },
              }}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
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
          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
    
    </>
  );
};

export default UpdateUserModal;
