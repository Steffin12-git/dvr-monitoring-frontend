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
import UserModal from "../add-users/UserModal"; 
import DeleteModal from "../../../../components/delete/DeleteModal";
import UpdateUserModal from "../update-user/UpdateUserModal";
import { useNavigate } from "react-router-dom";


/**
 * Interface representing a user object.
 */
interface User {
  id: string;
  username: string;
  role: string[];
}


/**
 * Component that displays a list of users, allowing for user management 
 * (adding, updating, and deleting users).
 *
 * @component
 * @returns {JSX.Element} The rendered UsersList component.
 */
const UsersList: React.FC = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const navigate = useNavigate();

  
  /**
  * Fetches the list of users from the server.
  * Handles errors and redirects to login if the user is unauthorized.
  */
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<User[]>("/users", {
        withCredentials: true,
      });
      console.log("Fetched users:", data);
      setUsers(data);
    }catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Unauthorized! Redirecting to login.");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
        } else if (error.response?.status === 403) {
          alert("You do not have permission to view locations.");
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
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 1000);
    return () => clearInterval(intervalId);
  }, []);
  


  /**
   * Opens the add user modal.
  */
  const handleOpenModal = () => setIsModalOpen(true);


  /**
   * Closes the Add User modal.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  

  /**
   * Opens the Delete Confirmation modal for a specific user.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleOpenDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };


  /**
   * Closes the Delete Confirmation modal.
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUserId(null);
  };


  /**
   * Deletes selected user 
   * Removes the user from the state if the request is successful.
   */
  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
  
    setIsDeleting(true);
  
    try {
      await axios.delete(`/users/${selectedUserId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUserId));
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };


  /**
   * Opens the Update User modal with selected user details.
   * @param {User} user - The user data to be updated.
   */
  const handleOpenUpdateModal = (user: User) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };
  


  /**
   * Handles the user update event and refetches the user list.
   */
  const handleUserUpdated = () => {
    fetchUsers(); 
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

        {/* User Table */}
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
                  Users
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
                        Role
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
                    {users.map((user, index) => (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          bgcolor: index % 2 === 0 ? "#f4ebeb" : "rgb(230, 222, 222)",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ textAlign: "left", width: "30%" }}>{user.username}</TableCell>

                        <TableCell sx={{ textAlign: "left", width: "30%" }}>
                          {Array.isArray(user.role) ? user.role.join(", ") : user.role}
                        </TableCell>

                        <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <IconButton
                            onClick={() =>  handleOpenUpdateModal(user)}
                            aria-label="edit"
                            sx={{ color: "#2d3748", mr: 1 }}
                          >
                            <BorderColorIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleOpenDeleteModal(user.id)}
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

      <UserModal open={isModalOpen} onClose={handleCloseModal} onUserAdded={fetchUsers} />
      <DeleteModal
        open={isDeleteModalOpen}
        userId={selectedUserId || ""}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        isLoading={isDeleting}
      />
       {selectedUser && (
      <UpdateUserModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        userId={selectedUser.id}
        initialUsername={selectedUser.username}
        initialRole={selectedUser.role}
        onUserUpdated={handleUserUpdated}
      />
    )}
    </Box>
  );
};

export default UsersList;
