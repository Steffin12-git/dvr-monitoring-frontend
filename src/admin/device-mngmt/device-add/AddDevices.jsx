/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../index";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AddCircleOutline, DeviceHub } from "@mui/icons-material";

export default function AddDevice() {
  const navigate = useNavigate();
  const [urlProfiles, setUrlProfiles] = useState([]);
  const [device, setDevice] = useState({
    name: "",
    urlProfile: "",
    special: false,
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting device:", device);

    const namePattern = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (!namePattern.test(device.name)) {
      toast.error(
        "Invalid name. Must be 4-20 characters long, alphanumeric, and cannot have consecutive or trailing dots/underscores."
      );
      return;
    }

    if (!device.name || !device.urlProfile) {
      toast.warn("Device name and URL profile are required.", {
        autoClose: 500,
      });
      return;
    }

    try {
      console.log("Data being sent to server:", {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });

      const response = await axios.post(`/locations`, {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });

      // if (response.status === 200) {
      if (response) {
        toast.success("Device added successfully!");
        setTimeout(() => navigate("/admin/locations"), 300);
      } else {
        toast.error("Failed to add device. Please try again.");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login");
        toast.error("Unauthorized. Please log in.");
      } else if (status === 403) {
        toast.error("User lacks permission to add the device.");
      } else if (status === 404) {
        toast.error("Location ID does not exist.");
      } else {
        toast.error("Failed to add device. Please try again.");
      }
      console.error(
        "Error adding device:",
        err.response ? err.response.data : err.message
      );
    }
  }
  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        // const response = await axios.get("/locations/urlProfiles");
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
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login");
          toast.error("Unauthorized access. Please log in.");
        }
      }
    }

    fetchUrlProfiles();
  }, []);
  function handleCancel() {
    navigate("/admin/locations");
  }

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: isSmallScreen ? 1 : 2,
      }}
    >
      <ToastContainer />
      <Box
        component="form"
        sx={{
          width: isSmallScreen ? "80%" : 400,
          padding: isSmallScreen ? 2 : 4,
          borderRadius: 5,
          boxShadow: 10,
          backgroundColor: "#ffffff",
        }}
        onSubmit={handleSubmit}
      >
        <Grid2 container direction="column" spacing={isSmallScreen ? 2 : 3}>
          <Grid2 item textAlign="center">
            <AddCircleOutline
              sx={{
                fontSize: isSmallScreen ? 40 : 50,
              }}
            />
            <Typography
              variant={isSmallScreen ? "h6" : "h5"}
              component="h2"
              gutterBottom
              sx={{
                color: "#111111",
                fontWeight: "bold",
              }}
            >
              Add Location
            </Typography>
          </Grid2>

          <Grid2 item>
            <TextField
              label="Device Name"
              variant="outlined"
              fullWidth
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              placeholder="Enter device name"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DeviceHub />
                  </InputAdornment>
                ),
              }}
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
              <MenuItem key="special" value="special">
                Special
              </MenuItem>
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

          <Grid2 item container justifyContent="center" spacing={2}>
            <Grid2 item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: "0.9rem", padding: "6px 16px" }}
              >
                Add Device
              </Button>
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleCancel}
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
