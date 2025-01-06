/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "../../../index";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
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
    name: location.state?.name || "",
    urlProfile: location.state?.urlProfile || "",
    special: location.state?.special || false,
  });
  const [urlProfiles, setUrlProfiles] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        const response = await axios.get("/devices/urlProfiles");
        if (Array.isArray(response?.data)) {
          setUrlProfiles(response.data.map((profile) => profile.name));
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
        toast.error("Failed to fetch URL profiles.");
      }
    }

    fetchUrlProfiles();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!device.name || device.name.length < 4) {
      toast.error("Device name must be at least 4 characters long.");
      return;
    }
    if (!device.urlProfile) {
      toast.error("Please select a URL profile.");
      return;
    }

    try {
      await axios.put(`/devices/${id}`, device);
      toast.success("Device updated successfully.");
      setTimeout(() => navigate("/devicesList"), 300);
    } catch (err) {
      console.error("Error updating device:", err);
      toast.error("Failed to update device.");
    }
  }

  return (
    <Grid2
    container
    justifyContent="center"
    alignItems="center"
    sx={{
      minHeight: "100vh",
      background: "#e0e0e0",
      padding: isSmallScreen ? 2 : 4,
    }}
  >
    <ToastContainer />
    <Box
      component="form"
      sx={{
        width: isSmallScreen ? "80%" : 400, // Decreased width for the Box
        padding: isSmallScreen ? 2 : 4,
        borderRadius: 5,
        boxShadow: 10,
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
            Edit Device
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
            sx={{ maxWidth: 350 }} 
          />
        </Grid2>
  
        <Grid2 item>
          <TextField
            label="URL Profile"
            variant="outlined"
            fullWidth
            select
            value={device.urlProfile}
            onChange={(e) => setDevice({ ...device, urlProfile: e.target.value })}
            required
            sx={{ maxWidth: 350 }} // Decreased width of the TextField
          >
            <MenuItem value="">Select URL Profile</MenuItem>
            {urlProfiles.map((profile, index) => (
              <MenuItem key={index} value={profile}>
                {profile}
              </MenuItem>
            ))}
          </TextField>
        </Grid2>
  
        <Grid2 item>
          <FormControlLabel
            control={
              <Checkbox
                checked={device.special}
                onChange={() =>
                  setDevice((prev) => ({ ...prev, special: !prev.special }))
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
              sx={{ fontSize: '0.9rem', padding: '6px 16px' }} // Smaller button size
            >
              Update
            </Button>
          </Grid2>
          <Grid2 item size={5}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/devicesList")}
              sx={{ fontSize: '0.9rem', padding: '6px 16px' }} // Smaller button size
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
