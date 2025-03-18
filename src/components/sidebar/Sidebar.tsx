/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuOpenIcon,
  MenuOpen as MenuCloseIcon, 
  PersonOutline,
  Place,
  Link,
  Description,
} from "@mui/icons-material";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setCollapsed }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Users", icon: <PersonOutline />, path: "/admin/users" },
    { text: "Locations", icon: <Place />, path: "/admin/locations" },
    { text: "URL Profiles", icon: <Link />, path: "/admin/urlProfiles" },
    { text: "Clients", icon: <Description />, path: "/admin/clients" },
  ];

  const [collapsed, setLocalCollapsed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) =>
      location.pathname.startsWith(item.path)
    );
    if (currentIndex !== -1) setSelectedIndex(currentIndex);
  }, [location.pathname]);

  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    navigate(path); 
  };

  const handleCollapseToggle = () => {
    setLocalCollapsed((prev) => !prev);
    setCollapsed((prev) => !prev);
  };

  const drawerWidth = collapsed ? 88 : 270;

  const drawerContent = (
    <Box
      sx={{
        backgroundColor: "#3e4d78",
        height: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",       }}
    >
      {/* Large Top Icon Section */}
      <Box
        sx={{
          p: collapsed ? 2 : 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          minHeight: 120,
        }}
      >
        <SecurityIcon
          sx={{
            fontSize: collapsed ? 50 : 170,
            transition: "all 0.2s ease",
            color: "white",
          }}
        />
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{
              backgroundColor:
                selectedIndex === index
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            <ListItemButton
              onClick={() => handleListItemClick(index, item.path)}
              sx={{
                px: collapsed ? 2.5 : 3,
                py: 1.5,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: "white",
                  mr: collapsed ? "auto" : 3,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& span": {
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Collapse Button - Now at Bottom Center */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <IconButton
          onClick={handleCollapseToggle}
          sx={{
            color: "white",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            p: 1.2,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          {collapsed ? <MenuOpenIcon fontSize="large" /> : <MenuCloseIcon fontSize="large" />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer
        variant="permanent"
        open
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
