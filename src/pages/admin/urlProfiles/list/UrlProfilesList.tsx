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
import axios from "../../../../main";
import Sidebar from "../../../../components/sidebar/Sidebar";
import ProfileMenu from "../../../../components/navbar/ProfileMenu";
import DeleteModal from "../../../../components/delete/DeleteModal";
import AddUrlProfileModal from "../add-urlProfile/AddUrlProfileModal";
import { useNavigate } from "react-router-dom";
import UpdateUrlProfileModal from "../update-urlProfile/UpdateUrlProfileModal";
import ImportUrlProfile from "../import-urlProfile/ImportUrlProfile";



/**
 * Interface for URL Profile.
 */
interface UrlProfile {
  name: string;
  urls: { name: string; template: string }[];
}

/**
 * `UrlProfilesList` Component
 *
 * This component displays a list of URL profiles with the ability to:
 * - Fetch URL profiles from the backend.
 * - Add, update, delete, import, and export URL profiles.
 * - Handle API errors and authentication failures.
 *
 * @component
 * @returns {JSX.Element} The URL profiles list component.
 */
const UrlProfilesList: React.FC = (): JSX.Element => {
  const [urlProfiles, setUrlProfiles] = useState<UrlProfile[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState<UrlProfile | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const navigate = useNavigate();


  /**
   * Fetches the list of URL profiles from the backend.
   * Handles authentication errors by redirecting to the login page.
   * 
   * @async
   * @function fetchUrlProfiles
   */
  const fetchUrlProfiles = async () => {
    try {
      const { data } = await axios.get<UrlProfile[]>("/urlProfiles", {
        withCredentials: true,
      });
      setUrlProfiles(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Unauthorized! Redirecting to login.");
          localStorage.clear();
          navigate("/login", { replace: true });
        } else {
          console.error("Error fetching URL profiles:", error);
          setError("Failed to load URL profiles.");
        }
      }
    } finally {
      setLoading(false);
    }
  };


  /**
   * Effect to fetch URL profiles on component mount.
   * Also sets up an interval to refresh the list every second.
   */
  useEffect(() => {
    setLoading(true);
    fetchUrlProfiles();
    const intervalId = setInterval(fetchUrlProfiles, 1000);
    return () => clearInterval(intervalId);
  }, []);


  /**
   * Handles the deletion of a URL profile.
   */
  const handleDeleteProfile = async () => {
    if (!selectedProfileName) return;
  
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/urlProfiles/${selectedProfileName}`, {
        withCredentials: true,
      });
      console.log("Delete response:", response); 
  

      // Remove deleted profile from state
      setUrlProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.name !== selectedProfileName)
      );
  
      handleCloseDeleteModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Delete Error:", error.response); 
        if (error.response?.status === 401) {
          setError("Unauthorized! Redirecting to login.");
          localStorage.clear();
          navigate("/login", { replace: true });
        } else if (error.response?.status === 403) {
          setError("Permission denied! You do not have access to delete this profile.");
        } else if (error.response?.status === 404) {
          setError("URL profile not found! It may have already been deleted.");
        } else {
          setError("Failed to delete URL profile.");
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };
  


   /**
   * Opens the delete confirmation modal.
   * @param {string} profileName - The name of the profile to be deleted.
   */
  const handleOpenDeleteModal = (profileName: string) => {
    setSelectedProfileName(profileName);
    setIsDeleteModalOpen(true);
  };



  /**
   * Closes the delete confirmation modal.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProfileName(null);
  };



   /**
   * Opens the update modal with selected profile data.
   * 
   * @param {UrlProfile} profile - The URL profile data to be updated.
   */
  const handleOpenUpdateModal = (profile: UrlProfile) => {
    setSelectedProfileData(profile);
    setIsUpdateModalOpen(true);
  };
  


   /**
   * Closes the update modal.
   */
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProfileData(null);
  };

  

   /**
   * Triggers URL profile export by opening the export API endpoint in a new tab.
   */
  const exportUrlProfile = () => {
    const exportUrl = axios.defaults.baseURL + "/urlProfiles/export";
    window.open(exportUrl, "_blank"); // Open in a new tab
  };
  

  return (
    <Box sx={{ display: "flex", backgroundColor: "#d8d8e1", minHeight: "100vh" }}>
      <Sidebar setCollapsed={setCollapsed} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: collapsed ? "88px" : "270px",
          transition: "margin 0.3s ease",
        }}
      >
        <ProfileMenu />

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
              URL Profiles
            </Typography>

            <Box>
              {/* First Button Before Add Button */}
              <Button
                variant="contained"
                onClick={() => setImportModalOpen(true)}
                sx={{
                  backgroundColor: "#2d3748",
                  "&:hover": { backgroundColor: "#1a202c" },
                  textTransform: "none",
                  marginRight: "10px",
                }}
              >
                Import
              </Button>

              {/* Add Button */}
              <Button
                variant="contained"
                onClick={() => setIsAddModalOpen(true)}
                sx={{
                  backgroundColor: "#2d3748",
                  "&:hover": { backgroundColor: "#1a202c" },
                  textTransform: "none",
                }}
              >
                Add
              </Button>

              {/* Second Button After Add Button */}
              <Button
                variant="contained"
                onClick={exportUrlProfile}
                sx={{
                  backgroundColor: "#2d3748",
                  "&:hover": { backgroundColor: "#1a202c" },
                  textTransform: "none",
                  marginLeft: "10px",
                }}
              >
                Export
              </Button>
            </Box>
          </Box>

                    

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#45527a" }}>
                      <TableCell sx={{ color: "white", fontWeight: "600" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "600", textAlign: "left" }}>
                        Urls
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: "600",
                          textAlign: "right",
                          paddingRight: 5,
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {urlProfiles.map((profile, index) => (
                      <TableRow
                        key={profile.name}
                        hover
                        sx={{
                          bgcolor: index % 2 === 0 ? "#f4ebeb" : "rgb(230, 222, 222)",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ textAlign: "left", width: "30%" }}>
                          {profile.name}
                        </TableCell>

                        <TableCell sx={{ textAlign: "left", width: "50%" }}>
                          {profile.urls.map((urlObj) => urlObj.name).join(", ")}
                        </TableCell>

                        <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <IconButton
                          onClick={() =>  handleOpenUpdateModal(profile)}
                            aria-label="edit"
                            sx={{ color: "#2d3748", mr: 1 }}
                          >
                            <BorderColorIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleOpenDeleteModal(profile.name)}
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

      <DeleteModal
        open={isDeleteModalOpen}
        userId={selectedProfileName || ""}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteProfile}
        title="Delete URL Profile"
        description="Are you sure you want to delete this URL profile?"
        isLoading={isDeleting}
      />
      <AddUrlProfileModal
      open={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      onProfileAdded={fetchUrlProfiles} 
      />

      <UpdateUrlProfileModal
        open={isUpdateModalOpen}
        profileData={selectedProfileData}
        onClose={handleCloseUpdateModal}
        onProfileUpdated={fetchUrlProfiles}
      />
      <ImportUrlProfile
        visible={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={() => {
          // Refresh the URL profile list
        }}
      />
    </Box>
  );
};

export default UrlProfilesList;
