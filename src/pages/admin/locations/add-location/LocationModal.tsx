import React, { useState, useEffect, JSX} from "react";
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
import axios from "../../../../main";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


/**
 * Props for the LocationModal component.
 */
interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onLocationAdded: () => void;
}


/**
 * Represents a URL profile fetched from the API.
 */
interface UrlProfile {
  name: string;
  urls: { name: string; template: string }[];
}


/**
 * 
 * A modal component that allows users to add a new location.
 * 
 * Features:
 * - Input field for entering the location name.
 * - Dropdown select for choosing a URL profile.
 * - Checkbox for enabling or disabling the location.
 * - Fetches URL profiles from an API endpoint.
 * - Displays error messages and handles API responses.
 * - Shows success and error notifications using Snackbar.
 *
 * @component
 * @param {LocationModalProps} props - Props for the component.
 * @returns {JSX.Element} The rendered LocationModal component.
 */
const LocationModal: React.FC<LocationModalProps> = ({ open, onClose, onLocationAdded }: LocationModalProps): JSX.Element => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [urlProfile, setUrlProfile] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [urlProfiles, setUrlProfiles] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUrlProfiles = async (): Promise<void> => {
    try {
      const { data } = await axios.get<UrlProfile[]>("/urlProfiles", { withCredentials: true });

      if (Array.isArray(data)) {
        setUrlProfiles(data.map((profile) => profile.name));
      } else {
        throw new Error("Unexpected response format: data is not an array");
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error fetching URL profiles:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized! Redirecting to login.");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchUrlProfiles();
  }, []);



   /**
   * Handles adding a new location by making a POST request to the API.
   * Performs validation before sending the request.
   * 
   * @async
   * @function handleAddLocation
   * @returns {Promise<void>}
   */
  const handleAddLocation = async (): Promise<void> => {
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const nameRegex = /^(?=[\p{L}\p{N}._])(?!.*[_.]{2})[^_.].*[^_.]$/gu;
    if (!nameRegex.test(name)) {
      setError("Invalid name format. Use letters, numbers, dots, or underscores without consecutive or trailing dots/underscores.");
      return;
    }

    if (!urlProfile) {
      setError("URL Profile selection is required.");
      return;
    }

    try {
      const response = await axios.post(
        "/locations",
        { name, urlProfile, isEnabled },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbar({ open: true, message: "Location added successfully!", severity: "success" });
        handleClose();
        onLocationAdded();
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        switch (status) {
          case 400:
            setError("Invalid input. Please check your data.");
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
            setError("Location name already exists.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
        }
      } else {
        console.log("Network error. Check your connection.");
      }
    }
  };


  /**
   * Handles closing the modal and resets the form fields.
   */
  const handleClose = () => {
    onClose();
    resetForm();
  };


  /**
   * Resets the form fields to their default state.
   */
  const resetForm = () => {
    setName("");
    setUrlProfile("");
    setIsEnabled(false);
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
          {/* Modal Title with Styled Background */}
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
              ADD LOCATION
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

            <FormControl fullWidth sx={{ mt: 2 }}>
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
              control={<Checkbox checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />}
              label="Enabled"
              sx={{ mt: 2 }}
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
                onClick={handleAddLocation}
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
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LocationModal;
