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
  const [device, setDevice] = useState({
    name: "",
    urlProfile: "",
    special: false,
  });
  const [urlProfiles, setUrlProfiles] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        const response = await axios.get("/devices/urlProfiles");
        if (response.status === 200) {
          const data = response.data;
          if (Array.isArray(data)) {
            setUrlProfiles(data.map((profile) => profile.name));
          } else {
            throw new Error("Invalid data format: Expected an array");
          }
        } else {
          toast.error("Failed to fetch URL profiles. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
        toast.error("An error occurred while fetching URL profiles.");
      }
    }

    fetchUrlProfiles();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!device.name || !device.urlProfile) {
      toast.warn("Device name and URL profile are required.", {
        autoClose: 500,
      });
      return;
    }

    try {
      const response = await axios.post(`/devices`, {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });

      if (response.status === 200) {
        toast.success("Device added successfully!");
        setTimeout(() => navigate("/devicesList"), 300);
      } else {
        toast.error("Failed to add device. Please try again.");
      }
    } catch (err) {
      console.error("Error adding device:", err);
      toast.error(
        "An error occurred while adding the device. Please try again.",
        { autoClose: 500 }
      );
    }
  }

  function handleCancel() {
    navigate("/devicesList");
  }

  return (
<Grid2
  container
  justifyContent="center"
  alignItems="center"
  sx={{
    minHeight: "100vh",
    background: "#e0e0e0",
    padding: isSmallScreen ? 1 : 2,
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
    <Grid2 container direction="column" spacing={isSmallScreen ? 2 : 3}>
      <Grid2 item textAlign="center">
        <AddCircleOutline
          sx={{
            fontSize: isSmallScreen ? 40 : 50,
            color: "#3f51b5",
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
          Add New Device
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
          sx={{ maxWidth: 350 }} // Decreased width of the TextField
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
          sx={{ maxWidth: 350 }} // Decreased width of the TextField
        >
          {urlProfiles.map((profileName, index) => (
            <MenuItem key={index} value={profileName}>
              {profileName}
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
            sx={{ fontSize: '0.9rem', padding: '6px 16px' }} 
          >
            Add Device
          </Button>
        </Grid2>
        <Grid2 item xs={12} sm={6}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleCancel}
            sx={{ fontSize: '0.9rem', padding: '6px 16px' }} 
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
