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
import AddClientModal from "../add-client/AddClientModal";
import UpdateClientModal from "../update-client/UpdateClientModal";
import QrcodeClient from "../qr-clients/QrcodeClient";
import DownloadFileClient from "../config-download/DownloadFileClient";
import { useNavigate } from "react-router-dom";


/**
 * Interface representing a Client object.
 */
interface Client {
  id: string;
  name: string;
  ipAddress: string;
  latestHandshakeAt: string;
}


/**
 * Component that displays a list of Clients, allowing for Client management 
 * (adding, updating, deleting, displaying qr code and downloading configuration file of Client).
 *
 * @component
 * @returns {JSX.Element} The rendered UsersList component.
 */

const ClientList: React.FC = (): JSX.Element => {
  const [Clients, setClients] = useState<Client[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedClient, setselectedClient] = useState<Client | null>(null);
  const [qrcodeClientOpen, setQrcodeClientOpen] = useState(false); 
  const [qrcodeClientId, setQrcodeClientId] = useState<string | null>(null); 
  const navigate = useNavigate();
  
  

  /**
  * Fetches the list of Clients from the server.
  * Handles errors and redirects to login if the user is unauthorized.
  */
  const fetchClients = async () => {
    try {
      const { data } = await axios.get<Client[]>("/clients", {
        withCredentials: true,
      });
      console.log("Fetched Clients:", data);
      setClients(data);
    }catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Unauthorized! Redirecting to login.");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
        } else if (error.response?.status === 403) {
          setError("You do not have permission to view Clients.");
        } else {
          console.error("Error fetching Clients:", error);
          setError("Failed to load Clients. Please check your permissions.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    const intervalId = setInterval(fetchClients, 1000);
    return () => clearInterval(intervalId);
  }, []);



  /**
   * Opens the Delete Confirmation modal for a specific Client.
   * @param {string} ClientId - The ID of the Client to delete.
   */
  const handleOpenDeleteModal = (ClientId: string) => {
    setSelectedClientId(ClientId);
    setIsDeleteModalOpen(true);
  };


  /**
   * Closes the Delete Confirmation modal.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedClientId(null);
  };


  /**
   * Deletes selected Client 
   * Removes the Client from the state if the request is successful.
   */
  const handleDeleteClient = async () => {
    if (!selectedClientId) return;

    setIsDeleting(true);

    try {
      await axios.delete(`/clients/${selectedClientId}`, { withCredentials: true });
      setClients((prevClients) => prevClients.filter((loc) => loc.id !== selectedClientId));
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
          setError("You do not have permission to delete this Client.");
        } else if (error.response?.status === 404) {
          setError("Client not found. It may have been already deleted.");
        } else {
          console.error("Error deleting Client:", error);
          setError("Error deleting Client:");
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * opens modal of addding new Client
   */
  const handleOpenAddClientModal = () => setIsAddClientModalOpen(true);

  /**
   * closes modal of addding Client
   */
  const handleCloseAddClientModal = () => setIsAddClientModalOpen(false);

  /**
   * Opens the Update Client modal with selected Client details.
   * @param {Client} client - The Client data to be updated.
   */
  const handleOpenUpdateModal = (client: Client) => {
    setselectedClient(client);
    setUpdateModalOpen(true);
  };
  

  /**
   * Opens the qr-code Client modal for the selected Client.
   * @param {ClientId} ClientId - id of the Client of the displayed qrcode.
   */
  const handleOpenQrCodeModal = (ClientId: string) => {
    setQrcodeClientId(ClientId);
    setQrcodeClientOpen(true);
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

        {/* Client Table */}
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
                  Clients
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpenAddClientModal} // Open modal on click
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
                    {Clients.map((Client, index) => (
                      <TableRow
                        key={Client.id}
                        hover
                        sx={{
                          bgcolor: index % 2 === 0 ? "#f4ebeb" : "rgb(230, 222, 222)",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ textAlign: "left"}}>
                          {Client.name} <br/> {Client.ipAddress}
                        </TableCell>

                        <TableCell sx={{ textAlign: "left"}}>
                          {Client.latestHandshakeAt
                                      ? moment(Client.latestHandshakeAt).startOf("seconds").fromNow()
                                      : "Not available"}
                        </TableCell>

                        <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <IconButton
                            onClick={() => handleOpenUpdateModal(Client)}
                            aria-label="edit"
                            sx={{ color: "#2d3748", mr: 1 }}
                          >
                            <BorderColorIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleOpenQrCodeModal(Client.id)}
                            aria-label="qrcode"
                            sx={{ color: "#2d3748", mr: 1 }}
                          >
                            <QrCodeScannerIcon />
                          </IconButton>

                          <DownloadFileClient deviceID={Client.id}/>

                          <IconButton
                            onClick={() => handleOpenDeleteModal(Client.id)}
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
      <AddClientModal
  open={isAddClientModalOpen}
  onClose={handleCloseAddClientModal}
  onClientAdded={fetchClients} 
/>

      <DeleteModal
        open={isDeleteModalOpen}
        userId={selectedClientId || ""}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        description="Are you sure you want to delete this Client?"
        isLoading={isDeleting}
      />
{selectedClient && (
  <UpdateClientModal
    open={updateModalOpen}
    onClose={() => setUpdateModalOpen(false)}
    clientId={selectedClient.id} 
    initialName={selectedClient.name}
    onClientUpdated={fetchClients} 
  />
)}
{qrcodeClientOpen && qrcodeClientId && (
  <QrcodeClient 
    visible={qrcodeClientOpen} 
    id={qrcodeClientId} 
    onClose={() => setQrcodeClientOpen(false)} 
  />
)}
    </Box>
  );
};

export default ClientList;
