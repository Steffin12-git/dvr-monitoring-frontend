import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>; // Async API call
  userId: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  userId,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this user? This action cannot be undone.",
  isLoading = false,
}) => {
  const [loading, setLoading] = useState(isLoading);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleDelete = async () => {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      setSnackbar({ open: true, message: "Invalid user ID.", severity: "error" });
      return;
    }
  
    setLoading(true);
    try {
      await onConfirm(userId); // Call API delete function
      setSnackbar({ open: true, message: "deleted successfully!", severity: "success" });
      onClose(); // Close modal after success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        let errorMessage = "Failed to delete user.";
  
        switch (status) {
          case 401:
            errorMessage = "Unauthorized. Please log in.";
            break;
          case 403:
            errorMessage = "You lack the required permissions.";
            break;
          case 404:
            errorMessage = "User not found.";
            break;
          default:
            errorMessage = error.response?.data?.message || "Something went wrong.";
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } else {
        setSnackbar({ open: true, message: "An unexpected error occurred.", severity: "error" });
      }
    }
    setLoading(false);
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
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={2}>
            {title}
          </Typography>

          <Typography variant="body1" color="textSecondary" mb={3}>
            {description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{
                borderRadius: "8px",
                py: 1,
                backgroundColor: "#e53e3e",
                "&:hover": {
                  backgroundColor: "#c53030",
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Delete"}
            </Button>
            <Button
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
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteModal;
