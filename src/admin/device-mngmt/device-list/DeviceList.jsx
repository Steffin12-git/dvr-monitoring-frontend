/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { PageContainer } from "@toolpad/core/PageContainer";
import qr_code from "../../../assets/icons/qr-code.png";
import Qrcode from "../qr-display/QrDisplay";
import Download_file from "../config-dwnld/ConfigDownload";
import MonitorTwoToneIcon from "@mui/icons-material/MonitorTwoTone";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import {
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "../../../index";
import deviceIcon from "../../../assets/icons/monitoring-main-icon.png";
import updateIcon from "../../../assets/icons/edit.png";
import deleteIcon from "../../../assets/icons/trash.png";
import Delete from "../../../components/delete-modal/Delete";
import Sidebar from "../../common/SideBar";
import { isDeviceOnline } from "../../../components/shared/DeviceStatus";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
}));

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const navigate = useNavigate();

  const fetchDevices = async () => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setAdminName(loggedInUser || " ");
    }
    try {
      const response = await axios.get("/locations");
      if (response && response.data) {
        setDevices(response.data);
      } else {
        toast.error("Failed to fetch devices", { autoClose: 800 });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/login");
        toast.error("Unauthorized access. Please log in again!", {
          autoClose: 800,
        });
      } else {
        toast.error("Failed to fetch devices. Please try again!", {
          autoClose: 800,
        });
      }
    }
  };

  useEffect(() => {
    fetchDevices();

    const intervalId = setInterval(() => {
      fetchDevices();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteAction = async (action, id = null) => {
    switch (action) {
      case "show":
        setSelectedDeviceId(id);
        setDeletePopupVisible(true);
        break;
      case "confirm":
        try {
          const response = await axios.delete(`/locations/${selectedDeviceId}`);
          if (response.status === 200) {
            setDevices(
              devices.filter((device) => device.id !== selectedDeviceId)
            );
            toast.success("Device deleted successfully", {
              autoClose: 800,
            });
          } else {
            toast.error("Failed to delete device", {
              autoClose: 800,
            });
          }
        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login");
            toast.error("Unauthorized. Please log in again.", {
              autoClose: 800,
            });
          } else if (err.response?.status === 403) {
            toast.error("User lacks permission to delete this device.", {
              autoClose: 800,
            });
          } else if (err.response?.status === 404) {
            toast.error("Location ID does not exist.", { autoClose: 800 });
          } else {
            toast.error("Error deleting device. Please try again!", {
              autoClose: 800,
            });
          }
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
        toast.warn("Invalid delete action.", {
          autoClose: 800,
        });
    }
  };

  return (
    <Sidebar adminUsername={adminName}>
      <PageContainer
        sx={{
          flexGrow: 1,
          minWidth: "100%",
          padding: 0,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#ffffff",
            maxWidth: "100%",
            height: "calc(100vh - 130px)",
          }}
        >
          <Grid2 container justifyContent="center" alignItems="center">
            <Grid2 item size={11}>
              <Grid2
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="h5"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    component="img"
                    src={deviceIcon}
                    alt="Device Icon"
                    sx={{ height: 30, mr: 1 }}
                  />
                  Locations
                </Typography>
                <Link to="/admin/locations/add">
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
                component={Box}
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  overflowX: "auto",
                  padding: 1,
                }}
              >
                <Table
                  sx={{
                    minWidth: 500,
                    tableLayout: "auto",
                    borderCollapse: "collapse",
                  }}
                >
                  <TableBody>
                    {devices.map((device) => {
                      const isOnline = isDeviceOnline(device.latestHandshakeAt);
                      return (
                        <TableRow
                          key={device.id}
                          sx={{
                            borderBottom: "1px solid #ddd",
                            height: 56,
                          }}
                        >
                          <StyledTableCell
                            sx={{
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                              maxWidth: "200px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <MonitorTwoToneIcon
                                  fontSize="medium"
                                  color="action"
                                />
                                {isOnline && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      backgroundColor: "green",
                                      border: "2px solid white",
                                    }}
                                  />
                                )}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="body1"
                                  sx={{ textAlign: "left" }}
                                >
                                  {device.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ textAlign: "left" }}
                                >
                                  {device.ipAddress}
                                </Typography>
                              </Box>
                            </Box>
                          </StyledTableCell>

                          <StyledTableCell
                            sx={{
                              textAlign: "center",
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                              fontSize: "0.9rem",
                            }}
                          >
                            {device.latestHandshakeAt
                              ? moment(device.latestHandshakeAt).format(
                                  "D MMMM YYYY, h:mm a"
                                )
                              : "N/A"}
                          </StyledTableCell>

                          <StyledTableCell
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              border: "none",
                            }}
                          >
                            <Link
                              to={`/admin/locations/update/${device.id}`}
                              state={{
                                name: device.name,
                                urlProfile: device.urlProfile,
                                special: device.special,
                              }}
                            >
                              <IconButton>
                                <Box
                                  component="img"
                                  src={updateIcon}
                                  alt="update"
                                  sx={{ width: "20px", height: "20px" }}
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
                              <Box
                                component="img"
                                src={deleteIcon}
                                alt="delete"
                                sx={{ width: "20px", height: "20px" }}
                              />
                            </IconButton>
                          </StyledTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
          </Grid2>
        </Box>
      </PageContainer>
      {deletePopupVisible && (
        <Delete
          title="Delete the device"
          description="Are you sure you want to delete the device?"
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
