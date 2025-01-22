/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "../../../index";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Edit, DeviceHub } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateDevice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [device, setDevice] = useState({
    name: location.state?.name,
    urlProfile: location.state?.urlProfile,
    special: Boolean(location.state?.special) || false,
  });
  const [urlProfiles, setUrlProfiles] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  async function handleSubmit(e) {
    e.preventDefault();

    const namePattern = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (!namePattern.test(device.name)) {
      toast.error(
        "Invalid name. Must be 4-20 characters long, alphanumeric, and cannot have consecutive or trailing dots/underscores."
      );
      return;
    }

    if (!device.urlProfile) {
      toast.error("Please select a URL profile.");
      return;
    }

    try {
      const response = await axios.put(`/locations/${id}`, {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });

      if (response.status === 200) {
        toast.success("Device updated successfully.");
        setTimeout(() => navigate("/admin/locations"), 300);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        toast.error("Invalid input. Check the device name and try again.");
      } else if (status === 401) {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login");
        toast.error("Unauthorized. Please log in.");
      } else if (status === 403) {
        toast.error("Insufficient permissions to update the device.");
      } else if (status === 404) {
        toast.error("Device not found.");
      } else if (status === 409) {
        toast.error("Conflict: A device with the same name already exists.");
      } else {
        toast.error("Failed to update device. Please try again.");
      }
      console.error(
        "Error updating device:",
        err.response ? err.response.data : err.message
      );
    }
  }

  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        const response = await axios.get("/urlProfiles");

        const data = await response.data;

        if (Array.isArray(data)) {
          const profileNames = data.map((profile) => profile.name);
          setUrlProfiles(profileNames);
        } else {
          throw new Error("Unexpected response format: data is not an array");
        }
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
        toast.error("Failed to fetch URL profiles. Please try again.");
        if (error.response?.status === 401) {
          toast.error("Unauthorized access. Please log in.");
        }
      }
    }

    fetchUrlProfiles();
  }, []);
  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: isSmallScreen ? 2 : 4,
      }}
    >
      <ToastContainer />
      <Box
        component="form"
        sx={{
          width: isSmallScreen ? "80%" : 400,
          padding: isSmallScreen ? 2 : 4,
          borderRadius: 5,
          boxShadow: 4,
          backgroundColor: "#ffffff",
        }}
        onSubmit={handleSubmit}
      >
        <Grid2 container direction="column" spacing={3}>
          <Grid2 item textAlign="center">
            <Edit
              sx={{
                fontSize: isSmallScreen ? 40 : 50,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant={isSmallScreen ? "h6" : "h5"}
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Edit Location
            </Typography>
          </Grid2>

          <Grid2 item>
            <TextField
              label="Device Name"
              variant="outlined"
              fullWidth
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DeviceHub />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter device name"
              required
            />
          </Grid2>

          <Grid2 item>
            <TextField
              label="URL Profile"
              variant="outlined"
              fullWidth
              select
              value={device.urlProfile}
              onChange={(e) =>
                setDevice({ ...device, urlProfile: e.target.value })
              }
              required
            >
              {urlProfiles.map((profile, index) => (
                <MenuItem key={index} value={profile}>
                  {profile}
                </MenuItem>
              ))}
              <MenuItem key='special' value='special'>Special</MenuItem>
            </TextField>
          </Grid2>

          <Grid2 item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={device.special}
                  onChange={() =>
                    setDevice({ ...device, special: !device.special })
                  }
                />
              }
              label="Special"
            />
          </Grid2>

          <Grid2 item container spacing={2} justifyContent="center">
            <Grid2 item size={5}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: "0.9rem", padding: "6px 16px" }}
              >
                Update
              </Button>
            </Grid2>
            <Grid2 item size={5}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate("/admin/locations")}
                sx={{ fontSize: "0.9rem", padding: "6px 16px" }}
              >
                Cancel
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Box>
    </Grid2>
  );
}
