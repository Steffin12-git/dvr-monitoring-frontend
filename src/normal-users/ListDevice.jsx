import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { extendTheme, ThemeProvider, styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "../index";
import main_logo from "../assets/icons/Main_logo.png";

const demoTheme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    background: {
      paper: "#fff",
    },
    text: {
      primary: "#173A5E",
      secondary: "#46505A",
    },
    action: {
      active: "#001E3C",
    },
    success: {
      dark: "#009688",
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  minWidth: 150,
}));

export default function DeviceListUser() {
  const navigate = useNavigate();
  const [urlProfiles, setUrlProfiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function fetchData() {
      try {
        const profilesResponse = await axios.get("/devices/urlProfiles");
        const profilesData = profilesResponse.data;

        const devicesResponse = await axios.get("/devices");
        const devicesData = devicesResponse.data;

        const profileMapping = profilesData.map((profile) => {
          const relatedDevices = devicesData.filter(
            (device) => device.urlProfile === profile.name
          );

          const groupedByTime = relatedDevices.reduce((acc, device) => {
            const time = device.latestHandshakeAt || "No Handshake Time";
            if (!acc[time]) acc[time] = [];
            acc[time].push(device.name);
            return acc;
          }, {});

          return {
            profileName: profile.name,
            groupedDevices: Object.entries(groupedByTime).map(
              ([time, devices]) => ({
                time,
                devices,
              })
            ),
          };
        });

        setUrlProfiles(profileMapping);
      } catch (err) {
        toast.error("Error fetching data. Please try again.");
      }
    }

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      toast.success("Logged out successfully!");
      localStorage.clear();
      setTimeout(() => navigate("/"), 350);
    } catch (err) {
      toast.error("Failed to log out");
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={demoTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#E0E0E0",
          padding: { xs: 1, sm: 3, md: 4 },
        }}
      >
        {/* Navbar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            padding: { xs: 1, sm: 2 },
            backgroundColor: demoTheme.palette.background.paper,
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={main_logo}
              alt="My_Logo"
              style={{ height: 40, marginLeft: 10 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: demoTheme.palette.primary.dark,
                fontSize: { xs: 14, sm: 18 },
              }}
            >
              Monitoring
            </Typography>
          </Box>
          <IconButton onClick={handleMenuClick}>
            <ManageAccountsIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: "#fff",
            padding: { xs: 1, sm: 2, md: 3 },
            borderRadius: 4,
            boxShadow: 20,
            marginTop: { xs: 8, sm: 9 },
            width: "100%",
            minHeight: "calc(70vh - 130px)",
          }}
        >
          <ToastContainer />
          <TableContainer
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
              width: "100%",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Profile Name</StyledTableCell>
                  <StyledTableCell>Last Seen</StyledTableCell>
                  <StyledTableCell>Devices</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urlProfiles.map((profile) =>
                  (profile.groupedDevices || []).map((group, index) => (
                    <TableRow key={`${profile.profileName}-${index}`}>
                      <StyledTableCell>{profile.profileName}</StyledTableCell>
                      <StyledTableCell>{group.time}</StyledTableCell>
                      <StyledTableCell>
                        {group.devices.join(" ")}
                      </StyledTableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
