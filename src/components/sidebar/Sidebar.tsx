/* eslint-disable react-hooks/exhaustive-deps */
import React, { JSX, useEffect, useState } from "react";
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


/**
 * Props for the Sidebar component.
 */
interface SidebarProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}


/**
 * Sidebar component for navigation within the admin panel.
 *
 * This component provides a collapsible sidebar containing navigation links
 * to different sections of the admin panel. Users can toggle its collapsed
 * state to show only icons or full labels.
 *
 * @param {SidebarProps} props - Component properties.
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const Sidebar: React.FC<SidebarProps> = ({ setCollapsed }: SidebarProps): JSX.Element => {
const theme = useTheme();
const navigate = useNavigate();
const location = useLocation();


/**
* List of menu items in the sidebar.
* @type {Array<{ text: string, icon: JSX.Element, path: string }>}
*/
const menuItems: Array<{ text: string; icon: JSX.Element; path: string; }> = [
{ text: "Users", icon: <PersonOutline />, path: "/admin/users" },
{ text: "Locations", icon: <Place />, path: "/admin/locations" },
{ text: "URL Profiles", icon: <Link />, path: "/admin/urlProfiles" },
{ text: "Clients", icon: <Description />, path: "/admin/clients" },
];

const [collapsed, setLocalCollapsed] = useState(false);
const [selectedIndex, setSelectedIndex] = useState<number>(0);


/**
* Updates the selected menu item based on the current route.
*/
useEffect(() => {
  const currentIndex = menuItems.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );
  if (currentIndex !== -1) setSelectedIndex(currentIndex);
}, [location.pathname]);


/**
 * Handles menu item click, updates the selected index, 
 * and navigates to the chosen path.
 * 
 * @param {number} index - Index of the selected menu item.
 * @param {string} path - Navigation path.
 */
const handleListItemClick = (index: number, path: string) => {
  setSelectedIndex(index);
  navigate(path); 
};


 /**
 * Toggles the sidebar collapse state.
 */
const handleCollapseToggle = () => {
  setLocalCollapsed((prev) => !prev);
  setCollapsed((prev) => !prev);
};
const drawerWidth = collapsed ? 88 : 270;


/**
 * Sidebar drawer content including navigation items and collapse button.
 * 
 * @returns {JSX.Element} Sidebar drawer content.
 */
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
