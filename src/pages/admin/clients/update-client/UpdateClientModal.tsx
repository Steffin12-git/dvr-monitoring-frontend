import React, { useState, useEffect, JSX } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../../../../main";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


/**
 * Props for the UpdateClientModal component.
 * 
*/
interface UpdateClientModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  initialName: string;
  onClientUpdated: () => void;
}


/**
 * UpdateClientModal Component
 * 
 * A modal for updating a client's name with validation and API interaction.
 * 
 * @component
 * @param {UpdateClientModalProps} props - The component props.
 * @returns {JSX.Element} The rendered modal component.
 */
const UpdateClientModal: React.FC<UpdateClientModalProps> = ({
  open,
  onClose,
  clientId,
  initialName,
  onClientUpdated,
}: UpdateClientModalProps): JSX.Element => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
    }
  }, [open, initialName]);


  /**
   * Handles client update API call with validation and error handling.
   * @async
   * @function handleUpdateClient
   * @returns {Promise<void>}
   */
  const handleUpdateClient = async (): Promise<void> => {
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Client name is required.");
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      setError("Client name must be alphanumeric.");
      setLoading(false);
      return;
    }

    try {
        await axios.put(`/clients/${clientId}`, { name }, { withCredentials: true });

      setSnackbar({ open: true, message: "Client updated successfully!", severity: "success" });

      onClientUpdated();
      setLoading(false);
      handleClose();
    } catch (err) {
      const errorResponse = (err as AxiosError).response;
      setLoading(false);
      if (errorResponse) {
        let errorMessage = "An unexpected error occurred. Please try again.";
        switch (errorResponse.status) {
          case 400:
            errorMessage = "Invalid client data.";
            break;
          case 401:
            errorMessage = "Unauthorized! Redirecting to login...";
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login", { replace: true });
            break;
          case 403:
            errorMessage = "Permission denied. Admin access required.";
            break;
          case 404:
            errorMessage = "Client not found.";
            break;
          case 409:
            errorMessage = "Client name already exists.";
            break;
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } else {
        setSnackbar({ open: true, message: "Network error. Check your connection.", severity: "error" });
      }
    }
  };


  /**
   * Closes the modal and resets the form.
   */
  const handleClose = () => {
    onClose();
    resetForm();
  };


   /**
   * Resets the form fields to their initial values.
   */
  const resetForm = () => {
    setName(initialName);
    setError("");
  };


   /**
   * Handles closing the snackbar notification.
   */
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
          {/* Modal Title */}
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
              UPDATE CLIENT
            </Typography>
          </Box>

          {/* Modal Content */}
          <Box component="form" sx={{ p: 4 }}>
            <TextField
              fullWidth
              label="Client Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ borderRadius: "8px" }}
            />

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {/* Modal Actions */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleUpdateClient}
                sx={{ borderRadius: "8px", backgroundColor: "#2d3b63", "&:hover": { backgroundColor: "#1a243d" } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "UPDATE"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{ borderRadius: "8px", borderColor: "#2d3b63", "&:hover": { borderColor: "#1a243d", backgroundColor: "rgba(45, 59, 99, 0.04)" } }}
                disabled={loading}
              >
                CANCEL
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateClientModal;
