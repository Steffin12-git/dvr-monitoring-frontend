/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { extendTheme, ThemeProvider, styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import MonitorTwoToneIcon from "@mui/icons-material/MonitorTwoTone";
import LaunchIcon from "@mui/icons-material/Launch";
import deviceIcon from "../../assets/icons/monitoring-main-icon.png";
import {
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "../../index";
import main_logo from "../../assets/icons/Main_logo.png";
import { isDeviceOnline } from "../../components/shared/DeviceStatus";
import moment from "moment";

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
  const [devices, setDevices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminUsername, setAdminUsername] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setAdminUsername(loggedInUser || " ");
    }

    async function fetchData() {
      try {
        const locationResponse = await axios.get("/locations");
        const locationData = locationResponse.data;
        const locations = locationData.filter((location) => {
          if (Boolean(location.special) === true) {
            return false;
          }
          return true;
        });

        const profileResponse = await axios.get("/urlProfiles");
        const profilesData = profileResponse.data;

        const mappedData = locations.map((location) => {
          const profile = profilesData.find(
            (profile) => profile.name === location.urlProfile
          );
          const urls = (profile?.urls || []).map((url) => ({
            name: url.name,
            link: url.template.replace("{ip}", location.ipAddress),
          }));
          return {
            ...location,
            urls,
          };
        });
        setDevices(mappedData);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login");
          toast.error("Unauthorized. Please log in.");
        } else {
          console.error("Error fetching data. Please try again.");
        }
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.clear();
      navigate("/login");
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
          backgroundColor: "#ffffff",
          padding: { xs: 1, sm: 3, md: 4 },
        }}
      >
        {/* Navbar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0e0",
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
            <MenuItem
              sx={{
                borderBottom: "2px solid  #e0e0e0e0",
                marginBottom: 2,
              }}
            >
              <AccountCircleSharpIcon
                sx={{
                  fontSize: 30,
                  marginRight: 0.5,
                }}
              />
              {adminUsername || "Admin"}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ marginLeft: 0 }}>
              <LogoutIcon sx={{ marginRight: 0.5 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // border:1,
            flexGrow: 1,
            overflow: "hidden",
            backgroundColor: "#fff",
            padding: { xs: 1, sm: 2, md: 3 },
            borderRadius: 4,
            marginTop: { xs: 8, sm: 9 },
            width: "80%",
            minHeight: "calc(70vh - 130px)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              component="img"
              src={deviceIcon}
              alt="Device Icon"
              sx={{ height: 30, mr: 1 }}
            />
            Locations
          </Typography>
          <ToastContainer />
          <TableContainer
            sx={{
              maxHeight: "70vh",
              padding: 1,
            }}
          >
            <Table>
              <TableBody>
                {devices.map((device) => {
                  const isOnline = isDeviceOnline(device.latestHandshakeAt);
                  return (
                    <TableRow key={device.id}>
                      <StyledTableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                              mr: 2,
                            }}
                          >
                            <MonitorTwoToneIcon
                              fontSize="medium"
                              sx={{
                                color: isOnline ? "green" : "black",
                              }}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ textAlign: "left" }}
                            >
                              {device.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ textAlign: "left" }}
                            >
                              {device.ipAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell>
                        {device.latestHandshakeAt ? (
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            Last seen {moment(device.latestHandshakeAt).startOf('seconds').fromNow()}
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            
                          </Typography>
                         
                        )}
                      </StyledTableCell>

                      <StyledTableCell
                        sx={{
                          textAlign: "right",
                        }}
                      >
                        {device.urls.map((url, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginRight: 1,
                            }}
                          >
                            <Link
                              key={index}
                              href={url.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {url.name}
                            </Link>
                            <LaunchIcon
                              sx={{
                                fontSize: "0.8em",
                              }}
                            />
                          </Box>
                        ))}
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
