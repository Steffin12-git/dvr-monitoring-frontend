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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../../../../main";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


/**
 * Props for the `UpdateLocationModal` component.
 */
interface UpdateLocationModalProps {
  open: boolean;
  onClose: () => void;
  locationId: string;
  initialName: string;
  initialUrlProfile: string;
  initialIsEnabled: boolean;
  onLocationUpdated: () => void;
}


/**
 * Interface representing a URL profile.
 */
interface UrlProfile {
  name: string;
  urls: { name: string; template: string }[];
}


/**
 * `UpdateLocationModal` component allows users to update an existing location's name, URL profile, and enabled state.
 * The component includes validation, error handling, and API integration.
 *
 * @component
 * @param {UpdateLocationModalProps} props - The component props.
 * @returns {JSX.Element} The `UpdateLocationModal` component.
 */
const UpdateLocationModal: React.FC<UpdateLocationModalProps> = ({
  open,
  onClose,
  locationId,
  initialName,
  initialUrlProfile,
  initialIsEnabled,
  onLocationUpdated,
}: UpdateLocationModalProps): JSX.Element => {
  const [name, setName] = useState(initialName);
  const [urlProfile, setUrlProfile] = useState(initialUrlProfile);
  const [isEnabled, setIsEnabled] = useState(initialIsEnabled);
  const [urlProfiles, setUrlProfiles] = useState<string[]>([]);
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
      fetchUrlProfiles();
      setName(initialName);
      setUrlProfile(initialUrlProfile);
      setIsEnabled(initialIsEnabled);
      setError("");
    }
  }, [open, initialName, initialUrlProfile, initialIsEnabled]);


  /**
   * Fetches available URL profiles from the API.
   */
  const fetchUrlProfiles = async () => {
    try {
      const { data } = await axios.get<UrlProfile[]>("/urlProfiles", { withCredentials: true });
      if (Array.isArray(data)) {
        setUrlProfiles(data.map((profile) => profile.name));
      } else {
        throw new Error("Unexpected response format: data is not an array");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error fetching URL profiles:", error);
      if (error.response?.status === 401) {
        setSnackbar({ open: true, message: "Unauthorized! Redirecting to login.", severity: "error" });
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login", { replace: true });
      }
    }
  };


  /**
   * Handles updating the location by making an API request.
   */
  const handleUpdateLocation = async (): Promise<void> => {
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    const nameRegex = /^(?=[\p{L}\p{N}._])(?!.*[_.]{2})[^_.].*[^_.]$/gu;
    if (!nameRegex.test(name)) {
      setError("Invalid name format. Use letters, numbers, dots, or underscores without consecutive or trailing dots/underscores.");
      return;
    }

    if (!urlProfile) {
      setError("URL Profile selection is required.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`/locations/${locationId}`, { name, urlProfile, isEnabled }, { withCredentials: true });

      setSnackbar({ open: true, message: "Location updated successfully!", severity: "success" });

      onLocationUpdated();
      setLoading(false);
      handleClose();
    } catch (err) {
      const errorResponse = (err as AxiosError).response;
      setLoading(false);
      if (errorResponse) {
        let errorMessage = "An unexpected error occurred. Please try again.";
        switch (errorResponse.status) {
          case 400:
            errorMessage = "Invalid location data.";
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
            errorMessage = "Location not found.";
            break;
          case 409:
            errorMessage = "Location name already exists.";
            break;
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } else {
        setSnackbar({ open: true, message: "Network error. Check your connection.", severity: "error" });
      }
    }
  };


  /**
   * Handles closing the modal and resetting the form.
   */
  const handleClose = () => {
    onClose();
    resetForm();
  };


  /**
   * Resets the form to its initial state.
   */
  const resetForm = () => {
    setName(initialName);
    setUrlProfile(initialUrlProfile);
    setIsEnabled(initialIsEnabled);
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
              UPDATE LOCATION
            </Typography>
          </Box>

          {/* Modal Content */}
          <Box component="form" sx={{ p: 4 }}>
            <TextField fullWidth label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={{ borderRadius: "8px" }} />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>URL Profile</InputLabel>
              <Select value={urlProfile || ""} onChange={(e) => setUrlProfile(e.target.value)} label="URL Profile" sx={{ borderRadius: "8px" }} disabled={urlProfiles.length === 0}>
                {urlProfiles.length > 0 ? urlProfiles.map((profile, index) => <MenuItem key={index} value={profile}>{profile}</MenuItem>) : <MenuItem disabled>No Profiles Available</MenuItem>}
              </Select>
            </FormControl>

            <FormControlLabel control={<Checkbox checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />} label="Enabled" sx={{ mt: 2 }} />

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {/* Modal Actions */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button fullWidth variant="contained" onClick={handleUpdateLocation} sx={{ borderRadius: "8px", backgroundColor: "#2d3b63", "&:hover": { backgroundColor: "#1a243d" } }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "UPDATE"}
              </Button>
              <Button fullWidth variant="outlined" onClick={handleClose} sx={{ borderRadius: "8px", borderColor: "#2d3b63", "&:hover": { borderColor: "#1a243d", backgroundColor: "rgba(45, 59, 99, 0.04)" } }} disabled={loading}>
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

export default UpdateLocationModal;
