/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { PageContainer } from "@toolpad/core/PageContainer";
import qr_code from "../../../assets/icons/qr-code.png";
import Qrcode from "../qr-display/QrDisplay";
import Download_file from "../config-dwnld/ConfigDownload";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

import {
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "../../../index";
import device from "../../../assets/icons/monitoring-main-icon.png";
import updateIcon from "../../../assets/icons/edit.png";
import deleteIcon from "../../../assets/icons/trash.png";
import Delete from "../../../components/delete-ui/Delete";
import Sidebar from "../../SideBar";

// Styled TableCell for MUI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
}));

export default function ListUser() {
  const [devices, setDevices] = useState([]);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setAdminName(parsedUser.name || " ");
    }

    async function fetchDevices() {
      try {
        const response = await axios.get("/devices");

        if (!response) {
          throw new Error("Failed to fetch devices");
        }

        const devicesData = response.data;
        setDevices(devicesData || []);
      } catch (err) {
        toast.error("Error fetching devices. Please try again.");
        console.error("Error fetching devices:", err);
      }
    }

    fetchDevices();
  }, []);

  /**
   * Handles various delete actions
   *
   * @param {string} action - The action to perform: "show", "confirm", or "cancel".
   * @param {string|null} id - The ID of the device to delete (only used for "show" action).
   */
  const handleDeleteAction = async (action, id = null) => {
    switch (action) {
      case "show":
        setSelectedDeviceId(id);
        setDeletePopupVisible(true);
        break;
      case "confirm":
        try {
          const response = await axios.delete(`/devices/${selectedDeviceId}`);

          if (response.status === 200) {
            setDevices(
              devices.filter((device) => device.id !== selectedDeviceId)
            );
            toast.success("Device deleted successfully!");
          } else {
            toast.error("Failed to delete device. Please try again.");
          }
        } catch (err) {
          toast.error("An error occurred while deleting the device.");
          console.error("Error deleting device:", err);
        } finally {
          setDeletePopupVisible(false);
          setSelectedDeviceId(null);
        }
        break;
      case "cancel":
        setDeletePopupVisible(false);
        setSelectedDeviceId(null);
        break;
      default:
        toast.warn("Invalid delete action.");
        console.error("Invalid action for delete");
    }
  };

  return (
    <Sidebar adminUsername={adminName}>
      <PageContainer
        sx={{
          flexGrow: 1,
          padding: 0,
          minWidth: "100%",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            boxShadow: 10,
            borderRadius: 5,
            padding: 5,
            backgroundColor: "#fff",
            overflow: "hidden",
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            height: "calc(100vh - 130px)",
            minHeight: "300px",
          }}
        >
          <ToastContainer/>
          <Grid2
            container
            justifyContent="center"
            alignItems="center"
            sx={{ overflowY: "auto", overflowX: { xs: "auto", md: "hidden" } }}
          >
            <Grid2 item size={10}>
              <Grid2
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component="img"
                    src={device}
                    alt="User"
                    sx={{ height: "25px", mr: 1 }}
                  />
                  Devices
                </Typography>
                <Link to="/devicesList/add">
                  <Button
                    variant="contained"
                    sx={{ display: "flex", alignItems: "center" }}
                    startIcon={<AddCircleOutlinedIcon />}
                  >
                    Add
                  </Button>
                </Link>
              </Grid2>

              <TableContainer
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Devices</StyledTableCell>
                      <StyledTableCell>Last Seen</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <StyledTableCell>{device.name}</StyledTableCell>
                        <StyledTableCell>
                          {device.latestHandshakeAt || "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Link
                            to={`/devicesList/update/${device.id}`}
                            state={{
                              name: device.name,
                              urlProfile: device.urlProfile,
                              special: device.special,
                            }}
                          >
                            <IconButton>
                              <img
                                src={updateIcon}
                                alt="update"
                                style={{ width: "20px", height: "20px" }}
                              />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => {
                              setSelectedDeviceId(device.id);
                              setQrCodeVisible(true);
                            }}
                          >
                            <img
                              src={qr_code}
                              alt="qr-code"
                              style={{ width: "20px", height: "20px" }}
                            />
                          </IconButton>
                          <IconButton>
                            <Download_file deviceID={device.id} />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteAction("show", device.id)
                            }
                          >
                            <img
                              src={deleteIcon}
                              alt="delete"
                              style={{ width: "20px", height: "20px" }}
                            />
                          </IconButton>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
          </Grid2>
        </Box>
      </PageContainer>

      {/* Delete confirmation pop-up */}
      {deletePopupVisible && (
        <Delete
          title={"Delete the user"}
          description={"Are you sure you want to delete the user?"}
          visible={deletePopupVisible}
          onAction={handleDeleteAction}
          onCancel={() => handleDeleteAction("cancel")}
          onConfirm={() => handleDeleteAction("confirm")}
        />
      )}
      <Qrcode
        visible={qrCodeVisible}
        id={selectedDeviceId}
        onClose={() => setQrCodeVisible(false)}
      />
    </Sidebar>
  );
}
