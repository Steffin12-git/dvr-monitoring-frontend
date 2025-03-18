import React, { JSX, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Link as LinkIcon,
  Monitor,
} from "@mui/icons-material";
import axios from "../../main";
import ProfileMenu from "../../components/navbar/ProfileMenu";
import moment from "moment";
import { isDeviceOnline } from "../../utils/isDeviceOnline";



/**
 * Represents a single location data object.
 */
interface LocationData {
  id: string;
  name: string;
  ipAddress: string;
  urlProfile: string;
  latestHandshakeAt: string;
  isEnabled: boolean;
}

/**
 * Represents a single URL object in a URL profile.
 */
interface Url {
  name: string;
  template: string;
}


/**
 * Represents a URL profile containing multiple URLs.
 */
interface UrlProfile {
  name: string;
  urls: Url[];
}


/**
 * Home component responsible for displaying a table of locations,
 * their last seen timestamps, and associated URL profiles.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const Home: React.FC = (): JSX.Element => {
  const [page, setPage] = useState<number>(0);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [urlProfiles, setUrlProfiles] = useState<UrlProfile[]>([]);
  const rowsPerPage = 9;


  /**
   * Fetches locations from the API and updates state.
   * Handles API request errors gracefully.
   */
  const fetchLocations = async () => {
    try {
      const { data } = await axios.get<LocationData[]>("/locations", {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" }, // Prevent caching issues
      });
      setLocations([...data]); // Spread ensures React detects changes
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  
  /**
   * Fetches URL profiles from the API and updates state.
   * Handles API request errors gracefully.
   */
  const fetchUrlProfiles = async () => {
    try {
      const { data } = await axios.get<UrlProfile[]>("/urlProfiles", {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" },
      });
      setUrlProfiles([...data]); // Spread ensures React detects changes
    } catch (error) {
      console.error("Error fetching URL profiles:", error);
    }
  };

  /**
   * Fetches initial data on component mount and sets up an interval
   * to refresh data every 5 seconds.
   */
  useEffect(() => {
    fetchLocations();
    fetchUrlProfiles();

    const interval = setInterval(() => {
      fetchLocations();
      fetchUrlProfiles();
    }, 5000); // Increased interval to 5s

    return () => clearInterval(interval);
  }, []);

  
  /**
   * Maps locations to their corresponding URL profiles.
   * 
   * @returns {Array} An array of locations with associated URL profile links.
   */
  const urlLocation = locations.map((location) => {
    const matchedProfile = urlProfiles.find((profile) => profile.name === location.urlProfile);
    return {
      ...location,
      links: matchedProfile?.urls || [],
    };
  });

  
  /**
   * Handles pagination changes.
   *
   * @param {number} newPage The new page number.
   */
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#d8d8e1", minHeight: "100vh" }}>
      <ProfileMenu />

      <Box
        sx={{
          bgcolor: "#f4ebeb",
          borderRadius: "12px",
          boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1)",
          mt: 1,
          mx: "auto",
          maxWidth: "90%",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#45527a" }}>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600", textAlign: "right", paddingRight: 3 }}>
                  Last Seen
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600", textAlign: "right", paddingRight: 8 }}>
                  Links
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {urlLocation
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((location, index) => {
                  const online = isDeviceOnline(location.latestHandshakeAt);
                                 
                  return (
                    <TableRow
                      key={location.id}
                      hover
                      sx={{
                        bgcolor: index % 2 === 0 ? "#f4ebeb" : "rgb(230, 222, 222)",
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
                          <Box sx={{ position: "relative", display: "inline-block" }}>
                            <Monitor sx={{ color: online ? "limegreen" : "black", fontSize: 30 }} />
                            {online && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  width: 10,
                                  height: 10,
                                  bgcolor: "limegreen",
                                  borderRadius: "50%",
                                  border: "1px solid white",
                                }}
                              />
                            )}
                          </Box>

                          <Box>
                            <Typography variant="body1">{location.name}</Typography>
                            <Typography variant="body2" sx={{ color: "#555" }}>
                              {location.ipAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ textAlign: "right" }}>
                        {location.latestHandshakeAt
                          ? moment(location.latestHandshakeAt).startOf("seconds").fromNow()
                          : "Not available"}
                      </TableCell>

                      <TableCell sx={{ textAlign: "right" }}>
                        {location.links.length > 0 ? (
                          location.links.map((link, linkIndex) => (
                            <Button
                              key={linkIndex}
                              variant="text"
                              href={link.template.replace("{ip}", location.ipAddress)}
                              target="_blank"
                              endIcon={<LinkIcon sx={{ fontSize: 16 }} />}
                              sx={{
                                textTransform: "none",
                                color: "#2d3748",
                                mr: 2,
                                "&:hover": { bgcolor: "#f7fafc" },
                              }}
                            >
                              {link.name}
                            </Button>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: "#718096" }}>
                            No Links
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgb(230, 222, 222)",
            p: 2,
            borderTop: "1px solid rgb(171, 173, 175)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#000000" }}>
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, urlLocation.length)} of ${urlLocation.length}`}
          </Typography>

          <IconButton onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={() => handlePageChange(page + 1)} disabled={page >= Math.ceil(urlLocation.length / rowsPerPage) - 1}>
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
