import React, { JSX, useEffect, useState } from "react";
import {
  Avatar,
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Snackbar,
  Typography,
  Alert,
} from "@mui/material";
import {
  ArrowDropDown,
  Person,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import axios from "../../main";
import { useNavigate, useLocation } from "react-router-dom";


/**
 * ProfileMenu Component
 * 
 * This component renders a navigation bar with a profile menu that includes:
 * - A monitoring app title and icon.
 * - A user profile section with a dropdown menu.
 * - A logout button that clears authentication details and redirects to login.
 * - An admin/home toggle button (visible for admin users).
 * - Snackbar notifications for logout success/failure.
 * 
 * @component
 * @returns {JSX.Element} The rendered ProfileMenu component.
 */
const ProfileMenu: React.FC = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [username, setUsername] = useState<string>("User");
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();


  /** Snackbar state for displaying feedback messages */
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });


  /** Load user details from local storage on mount */
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);
  }, []);



   /**
   * Opens the profile dropdown menu.
   * 
   * @param {React.MouseEvent<HTMLElement>} event - The click event that triggers the menu.
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /** Closes the profile dropdown menu. */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  /**
   * Redirects the user between the Admin panel and the Home page.
   * The button toggles based on the current route.
   */
  const handleRedirect = () => {
    if (location.pathname === "/") {
      navigate("/admin/users");
    } else {
      navigate("/");
    }
    handleMenuClose();
  };


   /**
   * Handles user logout by calling the logout API, 
   * clearing local storage, and redirecting to login.
   * 
   * @async
   */
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });

      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      navigate("/login", { replace: true });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.status === 400 ? "You are already logged out." : "Logout failed. Please try again.";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      } else {
        console.error("Unexpected error:", error);
        setSnackbar({ open: true, message: "An unexpected error occurred.", severity: "error" });
      }
    } finally {
      handleMenuClose();
    }
  };

  return (
    <>
      <AppBar position="static" elevation={4} sx={{ bgcolor: "#d8d8e1", mb: 3 }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Icon and Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ImportantDevicesIcon sx={{ fontSize: 40, color: "#2d3748" }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#2d3748",
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              MONITORING
            </Typography>
          </Box>

          {/* User Profile Section */}
          <IconButton onClick={handleMenuOpen} sx={{ gap: 1 }}>
            <Avatar sx={{ bgcolor: "#4a5568", width: 40, height: 40 }}>
              <Person sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="body1" sx={{ color: "#2d3748", fontWeight: 600 }}>
              {username}
            </Typography>
            <ArrowDropDown sx={{ color: "#718096" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            minWidth: 200,
            p: 1,
            backgroundColor: "#d8d8e1",
          },
        }}
      >
        {/* Admin or Home Button */}
        {role === "admin" && (
          <MenuItem onClick={handleRedirect} sx={{ p: 0, mb: 1 }}>
            <Button
              fullWidth
              startIcon={location.pathname === "/" ? <AdminIcon sx={{ fontSize: 24 }} /> : <HomeIcon sx={{ fontSize: 24 }} />}
              sx={{
                bgcolor: "#45527a",
                borderRadius: 3,
                color: "white",
                textTransform: "none",
                justifyContent: "center",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#3b4663" },
              }}
            >
              {location.pathname === "/" ? "Admin" : "Home"}
            </Button>
          </MenuItem>
        )}

        {/* Logout Button */}
        <MenuItem onClick={handleLogout} sx={{ p: 0 }}>
          <Button
            fullWidth
            startIcon={<LogoutIcon sx={{ fontSize: 24 }} />}
            sx={{
              bgcolor: "#45527a",
              borderRadius: 3,
              color: "white",
              textTransform: "none",
              justifyContent: "center",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#3b4663" },
            }}
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>

      {/* Snackbar for feedback messages */}
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

export default ProfileMenu;
