import React, { JSX, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "../../../../main";
import { useNavigate } from "react-router-dom";


/**
 * Props interface for the AddClientModal component.
 */
interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}


/**
 * AddClientModal Component
 * 
 * A modal dialog for adding new clients. It validates input, makes an API request,
 * and provides user feedback via a Snackbar notification.
 * 
 * @component
 * @param {AddClientModalProps} props - The component props.
 * @returns {JSX.Element} The rendered modal component.
 */
const AddClientModal: React.FC<AddClientModalProps> = ({
  open,
  onClose,
  onClientAdded,
}: AddClientModalProps): JSX.Element => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });


  /**
   * Handles adding a new client by sending a request to the API.
   * Performs validation before submission.
   * Displays success or error messages accordingly.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const handleAddClient = async (): Promise<void> => {
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      setError("Name must be alphanumeric.");
      return;
    }

    try {
      const response = await axios.post(
        "/clients",
        { name },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: "Client added successfully!",
          severity: "success",
        });
        handleClose();
        onClientAdded();
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        switch (status) {
          case 400:
            setError("Invalid client data. Please check your input.");
            break;
          case 401:
            setError("Unauthorized! Redirecting to login...");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login");
            break;
          case 403:
            setError("Permission denied. Admin access required.");
            break;
          case 409:
            setError("Client name already exists.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
        }
      } else {
        console.error("Network error. Check your connection.");
      }
    }
  };


  /**
   * Handles modal close action.
   * Resets form fields before closing.
   */
  const handleClose = () => {
    onClose();
    resetForm();
  };


  /**
   * Resets the input field and error state.
   */
  const resetForm = () => {
    setName("");
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
            borderRadius: "8px",
            boxShadow: 24,
            outline: "none",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              bgcolor: "#45527a",
              color: "white",
              textAlign: "center",
              p: 2,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ADD CLIENT
            </Typography>
          </Box>

          {/* Modal Content */}
          <Box component="form" sx={{ p: 4 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {/* Modal Actions */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleAddClient}
                sx={{
                  px: 4,
                  backgroundColor: "#2d3b63",
                  "&:hover": { backgroundColor: "#1a243d" },
                }}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  px: 4,
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

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddClientModal;
