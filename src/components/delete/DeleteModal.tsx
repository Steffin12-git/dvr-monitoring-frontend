import React, { JSX, useState } from "react";
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


/**
 * Props for the DeleteConfirmationModal component.
 */
interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>; // Async API call
  userId: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
}


/**
 * A confirmation modal for deleting a user.
 *
 * - Displays a confirmation message before deletion.
 * - Calls the `onConfirm` function when the delete button is clicked.
 * - Shows a loading indicator while the deletion request is in progress.
 * - Displays success or error messages using a snackbar.
 *
 * @component
 * @param {DeleteConfirmationModalProps} props - The component props.
 * @returns {JSX.Element} The delete confirmation modal.
 */
const DeleteModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  userId,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this user?",
  isLoading = false,
}: DeleteConfirmationModalProps): JSX.Element => {
  const [loading, setLoading] = useState(isLoading);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });


  /**
   * Handles the delete action.
   * - Validates the user ID.
   * - Calls the `onConfirm` function.
   * - Displays success or error messages based on the API response.
   */
  const handleDelete = async () => {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      setSnackbar({ open: true, message: "Invalid user ID.", severity: "error" });
      return;
    }
  
    setLoading(true);
    try {
      await onConfirm(userId); 
      setSnackbar({ open: true, message: "Deleted successfully!", severity: "success" });
      onClose(); 
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
            borderRadius: "8px",
            boxShadow: 24,
            outline: "none",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Title Section - Styled like other modals */}
          <Box
            sx={{
              bgcolor: "#45527a",
              color: "white",
              textAlign: "center",
              py: 1.5,
            }}
          >
            <Typography variant="h6">{title}</Typography>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 3 }}>
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
                  backgroundColor: "#45527a",
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
