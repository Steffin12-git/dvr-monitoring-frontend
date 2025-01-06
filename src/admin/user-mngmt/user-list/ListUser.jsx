import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
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
import { Link } from "react-router-dom";
import axios from "../../../index";
import Sidebar from "../../SideBar";
import User from "../../../assets/icons/user.png";
import updateIcon from "../../../assets/icons/edit.png";
import deleteIcon from "../../../assets/icons/trash.png";
import Delete from "../../../components/delete-ui/Delete";
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

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setAdminUsername(parsedUser.username || "");
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data || []);
      } catch (err) {
        console.error("Error fetching users", err);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

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
            setUsers(users.filter((user) => user.id !== selectedUserId));
            toast.success("User deleted successfully");
          } else {
            toast.error("Failed to delete user");
          }
        } catch (err) {
          console.error("Error deleting user: ", err);
          toast.error("Error deleting user");
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
        toast.warn("Invalid delete action.");
    }
  };

  return (
    <Sidebar adminUsername={adminUsername}>
      <PageContainer
        sx={{ flexGrow: 1, minWidth: "100%", padding: 0, overflow: "auto" }}
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
          <ToastContainer />
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
                <Typography
                  variant="h5"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    component="img"
                    src={User}
                    alt="User"
                    sx={{ height: "25px", mr: 1 }}
                  />
                  Users
                </Typography>
                <Link to="/usersList/add">
                  <Button
                    variant="contained"
                    sx={{ display: "flex", alignItems: "center" }}
                    startIcon = {<AddCircleOutlinedIcon/>}
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
                      <StyledTableCell>Username</StyledTableCell>
                      <StyledTableCell>Role</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <StyledTableCell>{user.username}</StyledTableCell>
                        <StyledTableCell>{user.role}</StyledTableCell>
                        <StyledTableCell>
                          <Link
                            to={`/usersList/update/${user.id}`}
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
