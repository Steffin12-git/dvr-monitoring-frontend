/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  TableHead,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../index";
import Sidebar from "../../common/SideBar";
import User from "../../../assets/icons/user.png";
import updateIcon from "../../../assets/icons/edit.png";
import deleteIcon from "../../../assets/icons/trash.png";
import Delete from "../../../components/delete-modal/Delete";
import { PageContainer } from "@toolpad/core";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
}));

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminUsername, setAdminUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setAdminUsername(loggedInUser || " ");
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        if (response && response.data) {
          setUsers(response.data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login");
          toast.error("Unauthorized: Please log in.", { autoClose: 800 });
        } else if (err.response?.status === 403) {
          toast.error("Permission Denied: You lack the required permissions.", {
            autoClose: 800,
          });
        } else {
          console.error("Failed to fetch users. Please try again!");
        }
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();

    const intervalId = setInterval(() => {
      fetchUsers();
    }, 3000);

    return () => clearInterval(intervalId);
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
        setSelectedUserId(id);
        setDeletePopupVisible(true);
        break;
      case "confirm":
        try {
          const response = await axios.delete(`/users/${selectedUserId}`);
          if (response.status === 200) {
            const loggedInUserId = localStorage.getItem("userId");
            if (loggedInUserId === selectedUserId) {
              localStorage.removeItem("username");
              localStorage.removeItem("role");
              localStorage.removeItem("userId");
              navigate("/login");
            } else {
              setUsers(users.filter((user) => user.id !== selectedUserId));
              toast.success("User deleted successfully", {
                autoClose: 800,
              });
            }
          } else {
            console.error("Failed to delete user");
          }
        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login");
            toast.error("Unauthorized: Please log in.", { autoClose: 800 });
          } else if (err.response?.status === 403) {
            toast.error(
              "Permission Denied: You lack the required permissions.",
              {
                autoClose: 800,
              }
            );
          } else if (err.response?.status === 404) {
            toast.error("User ID does not exist.", { autoClose: 800 });
          } else {
            toast.error("Error deleting user", { autoClose: 800 });
          }
          console.error("Error deleting user: ", err);
        } finally {
          setDeletePopupVisible(false);
          setSelectedUserId(null);
        }
        break;
      case "cancel":
        setDeletePopupVisible(false);
        setSelectedUserId(null);
        break;
      default:
        toast.warn("Invalid delete action.", {
          autoClose: 800,
        });
    }
  };

  return (
    <Sidebar adminUsername={adminUsername}>
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
                    src={User}
                    alt="User"
                    sx={{ height: 30, mr: 1 }}
                  />
                  Users
                </Typography>
                <Link to="/admin/users/add">
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
                  padding: 1,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ textAlign: "left" }}>
                        Name
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "left" }}>
                        Role
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ textAlign: "end", paddingRight: 3 }}
                      >
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <StyledTableCell sx={{ textAlign: "left" }}>
                          {user.username}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "left" }}>
                          {user.role}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <Link
                            to={`/admin/users/update/${user.id}`}
                            state={{ username: user.username, role: user.role }}
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
                            onClick={() => handleDeleteAction("show", user.id)}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
          </Grid2>
        </Box>
      </PageContainer>
      {deletePopupVisible && (
        <Delete
          title="Delete the user"
          description="Are you sure you want to delete the user?"
          visible={deletePopupVisible}
          onAction={handleDeleteAction}
          onCancel={() => handleDeleteAction("cancel")}
          onConfirm={() => handleDeleteAction("confirm")}
        />
      )}
    </Sidebar>
  );
}
