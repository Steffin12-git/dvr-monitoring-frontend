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
} from "@mui/material";
import axios from "../../../../main" 
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


/**
 * Props for the UpdateUserModal component.
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
 * Props for the urlProfile.
*/
interface UrlProfile {
  name: string;
  urls: { name: string; template: string }[];
}


/**
 * UpdateLocationModal component allows updating location details.
 *
 * @component
 * @param {UpdateLocationModalProps} props - The component props.
 * @returns {JSX.Element} The rendered UpdateUserModal component.
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

  // Fetch URL profiles on modal open
  useEffect(() => {
    if (open) {
      fetchUrlProfiles();
      setName(initialName);
      setUrlProfile(initialUrlProfile);
      setIsEnabled(initialIsEnabled);
      setError("");
    }
  }, [open, initialName, initialUrlProfile, initialIsEnabled]);

  const fetchUrlProfiles = async () => {
    try {
      const { data } = await axios.get<UrlProfile[]>("/urlProfiles", {
        withCredentials: true,
      });

      if (Array.isArray(data)) {
        const profileNames = data.map((profile) => profile.name);
        setUrlProfiles(profileNames);
      } else {
        throw new Error("Unexpected response format: data is not an array");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error fetching URL profiles:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized! Redirecting to login.");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
      }
    }
  };


  /**
   * Handles the location update process.
   * Performs validation, sends a request to update the location, and handles API responses.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleUpdateLocation = async (): Promise<void> => {
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      setError("Name must be alphanumeric.");
      setLoading(false);
      return;
    }

    if (!urlProfile) {
      setError("URL Profile selection is required.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `/locations/${locationId}`,
        { name, urlProfile, isEnabled },
        { withCredentials: true }
      );

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
            setError("Unauthorized. Please log in.");
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
   * closes the upadte location modal
   */
  const handleClose = () => {
    onClose();
    resetForm();
  };


  /**
   * resets the form after completion
   */
  const resetForm = () => {
    setName(initialName);
    setUrlProfile(initialUrlProfile);
    setIsEnabled(initialIsEnabled);
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
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
            Update Location
          </Typography>

          <Box component="form" sx={{ display: "grid", gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                sx: { borderRadius: "8px" },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>URL Profile</InputLabel>
              <Select
                value={urlProfile || ""}
                onChange={(e) => setUrlProfile(e.target.value)}
                label="URL Profile"
                sx={{ borderRadius: "8px" }}
                disabled={urlProfiles.length === 0}
              >
                {urlProfiles.length > 0 ? (
                  urlProfiles.map((profile, index) =>
                    profile ? (
                      <MenuItem key={index} value={profile}>
                        {profile}
                      </MenuItem>
                    ) : null
                  )
                ) : (
                  <MenuItem disabled>No Profiles Available</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                />
              }
              label="Enabled"
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
                onClick={handleUpdateLocation}
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

      {/* Snackbar for Success/Error Messages */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateLocationModal;
