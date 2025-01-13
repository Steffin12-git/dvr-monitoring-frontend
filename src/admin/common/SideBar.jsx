import React, { useState } from "react";
import { extendTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import DevicesIcon from "@mui/icons-material/Devices";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import main_logo from "../../assets/icons/Main_logo.png";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../index";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";

const demoTheme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
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

const Sidebar = ({ adminUsername, children }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const NAVIGATION = [
    {
      segment: "admin/users",
      title: "Users",
      icon: <GroupIcon />,
    },
    {
      segment: "admin/locations",
      title: "Locations",
      icon: <DevicesIcon />,
    },
  ];
  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.reload();
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");
      if (response) {
        localStorage.clear();
         navigate("/login");
      } else {
        toast.error("Failed to log out!", {
          autoClose: 800,
        });
        throw new Error("Failed to log out");
      }
    } catch (err) {
      console.error("Error during logout: ", err);
      toast.error("Failed to log out");
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{
        title: (
          <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            Monitoring
          </div>
        ),
        logo: (
          <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            <img src={main_logo} alt="My_Logo" />
          </div>
        ),
        titleLink: false,
      }}
    >
      <DashboardLayout
        sx={{
          display: "flex",
          minWidth: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
          backgroundColor: "#ffffff",
          "& .MuiDrawer-paper": {
            maxWidth: 240,
            boxSizing: "border-box",
          },
          position: "relative",
        }}
      >
        <ToastContainer />
        <IconButton
          onClick={handleMenuClick}
          sx={{
            position: "absolute",
            top: 10,
            right: 20,
            zIndex: 1500,
          }}
        >
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
        {children}
      </DashboardLayout>
    </AppProvider>
  );
};

export default Sidebar;
