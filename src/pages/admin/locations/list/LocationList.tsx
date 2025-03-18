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
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  BorderColor as BorderColorIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import axios from "../../../../main";
import Sidebar from "../../../../components/sidebar/Sidebar";
import ProfileMenu from "../../../../components/navbar/ProfileMenu";
import DeleteModal from "../../../../components/delete/DeleteModal";
import moment from "moment";
import LocationModal from "../add-location/LocationModal";
import UpdateLocationModal from "../update-location/UpdateLocationModal";
import QrcodeLocation from "../qr-location/QrcodeLocation";
import DownloadFile from "../conf-download/DownloadFile";
import { useNavigate } from "react-router-dom";


/**
 * Interface representing a location object.
 */
interface Location {
  id: string;
  name: string;
  ipAddress: string;
  urlProfile: string;
  latestHandshakeAt: string;
  isEnabled: boolean;
}


/**
 * Component that displays a list of Locations, allowing for Location management 
 * (adding, updating, deleting, displaying qr code and downloading configuration file of location).
 *
 * @component
 * @returns {JSX.Element} The rendered UsersList component.
 */

const LocationList: React.FC = (): JSX.Element => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [qrcodeLocationOpen, setQrcodeLocationOpen] = useState(false); 
  const [qrcodeLocationId, setQrcodeLocationId] = useState<string | null>(null); 
  const navigate = useNavigate();
  
  

  /**
  * Fetches the list of locations from the server.
  * Handles errors and redirects to login if the user is unauthorized.
  */
  const fetchLocations = async () => {
    try {
      const { data } = await axios.get<Location[]>("/locations", {
        withCredentials: true,
      });
      console.log("Fetched locations:", data);
      setLocations(data);
    }catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Unauthorized! Redirecting to login.");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
        } else if (error.response?.status === 403) {
          setError("You do not have permission to view locations.");
        } else {
          console.error("Error fetching locations:", error);
          setError("Failed to load locations. Please check your permissions.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    const intervalId = setInterval(fetchLocations, 1000);
    return () => clearInterval(intervalId);
  }, []);



  /**
   * Opens the Delete Confirmation modal for a specific Location.
   * @param {string} locationId - The ID of the Location to delete.
   */
  const handleOpenDeleteModal = (locationId: string) => {
    setSelectedLocationId(locationId);
    setIsDeleteModalOpen(true);
  };


  /**
   * Closes the Delete Confirmation modal.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedLocationId(null);
  };


  /**
   * Deletes selected location 
   * Removes the location from the state if the request is successful.
   */
  const handleDeleteLocation = async () => {
    if (!selectedLocationId) return;

    setIsDeleting(true);

    try {
      await axios.delete(`/locations/${selectedLocationId}`, { withCredentials: true });
      setLocations((prevLocations) => prevLocations.filter((loc) => loc.id !== selectedLocationId));
      handleCloseDeleteModal();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Unauthorized! Redirecting to login.");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
        } else if (error.response?.status === 403) {
          setError("You do not have permission to delete this location.");
        } else if (error.response?.status === 404) {
          setError("Location not found. It may have been already deleted.");
        } else {
          console.error("Error deleting location:", error);
          setError("Error deleting location:");
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * opens modal of addding new location
   */
  const handleOpenModal = () => setIsModalOpen(true);


  /**
   * closes modal of addding location
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  /**
   * Opens the Update Location modal with selected location details.
   * @param {Location} location - The location data to be updated.
   */
  const handleOpenUpdateModal = (location: Location) => {
    setSelectedLocation(location);
    setUpdateModalOpen(true);
  };
  

  /**
   * Opens the qr-code Location modal for the selected location.
   * @param {locationId} locationId - id of the location of the displayed qrcode.
   */
  const handleOpenQrCodeModal = (locationId: string) => {
    setQrcodeLocationId(locationId);
    setQrcodeLocationOpen(true);
  };
    

  return (
    <Box sx={{ display: "flex", backgroundColor: "#d8d8e1", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar setCollapsed={setCollapsed} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: collapsed ? "88px" : "270px",
          transition: "margin 0.3s ease",
        }}
      >
        <ProfileMenu />

        {/* Location Table */}
        <Box
          sx={{
            mt: 4,
            mx: 4,
            my: 2,
            bgcolor: "#f4ebeb",
            borderRadius: "12px",
            boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography variant="h6" color="error" align="center" sx={{ py: 4 }}>
              {error}
            </Typography>
          ) : (
            <>
              {/* Header Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  bgcolor: "#45527a",
                  borderBottom: "1px solid rgb(163, 155, 155)",
                }}
              >
                <Typography variant="h6" sx={{ color: "white", fontWeight: "600" }}>
                  Locations
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpenModal} // Open modal on click
                  sx={{
                    backgroundColor: "#2d3748",     
                   "&:hover": { backgroundColor: "#1a202c" },
                    textTransform: "none",
                  }}
                  >        
                    Add           
                </Button>
              
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#45527a" }}>
                      <TableCell sx={{ color: "white", fontWeight: "600" }}>
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ color: "white", fontWeight: "600", textAlign: "left" }}
                      >
                        Last Seen
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "600",
                          textAlign: "right",
                          paddingRight: 5,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {locations.map((location, index) => (
                      <TableRow
                        key={location.id}
                        hover
                        sx={{
                          bgcolor: index % 2 === 0 ? "#f4ebeb" : "rgb(230, 222, 222)",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ textAlign: "left"}}>
                          {location.name} <br/> {location.ipAddress}
                        </TableCell>

                        <TableCell sx={{ textAlign: "left"}}>
                          {location.latestHandshakeAt
                                      ? moment(location.latestHandshakeAt).startOf("seconds").fromNow()
                                      : "Not available"}
                        </TableCell>

                        <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <IconButton
                            onClick={() => handleOpenUpdateModal(location)}
                            aria-label="edit"
                            sx={{ color: "#2d3748", mr: 1 }}
                          >
                            <BorderColorIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleOpenQrCodeModal(location.id)}
                            aria-label="qrcode"
                            sx={{ color: "#2d3748", mr: 1 }}
                          >
                            <QrCodeScannerIcon />
                          </IconButton>

                          <DownloadFile deviceID={location.id}/>

                          <IconButton
                            onClick={() => handleOpenDeleteModal(location.id)}
                            aria-label="delete"
                            sx={{ color: "#e53e3e" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Box>
      <LocationModal open={isModalOpen} onClose={handleCloseModal} onLocationAdded={fetchLocations} />
      <DeleteModal
        open={isDeleteModalOpen}
        userId={selectedLocationId || ""}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteLocation}
        title="Delete Location"
        description="Are you sure you want to delete this location?"
        isLoading={isDeleting}
      />
{selectedLocation && (
  <UpdateLocationModal
    open={updateModalOpen}
    onClose={() => setUpdateModalOpen(false)}
    locationId={selectedLocation.id}
    initialName={selectedLocation.name}
    initialUrlProfile={selectedLocation.urlProfile}
    initialIsEnabled={selectedLocation.isEnabled}
    onLocationUpdated={fetchLocations}
  />
)}
{qrcodeLocationOpen && qrcodeLocationId && (
  <QrcodeLocation 
    visible={qrcodeLocationOpen} 
    id={qrcodeLocationId} 
    onClose={() => setQrcodeLocationOpen(false)} 
  />
)}
    </Box>
  );
};

export default LocationList;
