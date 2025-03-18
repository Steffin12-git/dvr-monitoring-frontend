import React, { useEffect, useState } from "react";
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
} from "@mui/icons-material";
import axios from "../../main";
import ProfileMenu from "../../components/navbar/ProfileMenu";
import moment from "moment";



/**
 * Interface representing location data.
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
 * Interface representing a URL object.
 */
interface Url {
  name: string;
  template: string;
}



/**
 * Interface representing a URL profile containing multiple URLs.
 */
interface UrlProfile {
  name: string; 
  urls: Url[];
}

/**
 * The `Home` component displays a table of locations fetched from an API.
 * Each location has associated URL profiles with links that dynamically
 * replace `{ip}` with the location's IP address.
 *
 * The component includes:
 * - Fetching locations from the `/locations` API endpoint.
 * - Fetching URL profiles from the `/urlProfiles` API endpoint.
 * - Formatting timestamps using `moment.js`.
 * - A navbar menu (`ProfileMenu`).
 *
 * @component
 * @returns {React.FC} The Home component.
 */
const Home: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [urlProfiles, setUrlProfiles] = useState<UrlProfile[]>([]);
  const rowsPerPage = 9;



  /**
   * Fetches the list of locations from the API and updates state.
  */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await axios.get<LocationData[]>("/locations", {
          withCredentials: true, 
        });
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);



  /**
   * Fetches the list of URL profiles from the API and updates state.
   */
  useEffect(() => {
    const fetchUrlProfiles = async () => {
      try {
        const { data } = await axios.get<UrlProfile[]>("/urlProfiles", {
          withCredentials: true, 
        });
        setUrlProfiles(data);
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
      }
    };
    fetchUrlProfiles();
  }, []);



  /**
   * Maps URL profiles to locations, filling each location with its respective URLs.
   */
  const urlLocation = locations.map((location) => {
    const matchedProfile = urlProfiles.find(
      (profile) => profile.name === location.urlProfile
    );
    return {
      ...location,
      links: matchedProfile?.urls || [],
    };
  });



  /**
   * Handles pagination by updating the `page` state.
   * @param {number} newPage - The new page number.
   */
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#d8d8e1", minHeight: "100vh" }}>
      {/* Navbar */}
      <ProfileMenu />

      {/* Main Content */}
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
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  Name
                </TableCell>
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
                .map((location, index) => (
                  <TableRow
                    key={location.id}
                    hover
                    sx={{
                      bgcolor: index % 2 === 0 ? "#f4ebeb" : "rgb(230, 222, 222)",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      {location.name}
                      <br />
                      {location.ipAddress}
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
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
            {`${page * rowsPerPage + 1}-${Math.min(
              (page + 1) * rowsPerPage,
              urlLocation.length
            )} of ${urlLocation.length}`}
          </Typography>

          <IconButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= Math.ceil(urlLocation.length / rowsPerPage) - 1}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
