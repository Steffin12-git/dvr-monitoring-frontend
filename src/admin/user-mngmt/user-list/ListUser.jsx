/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../../../index.css";
import axios from "../../../index";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import SideBar from "../../SideBar";
import User from "../../../assets/icons/user.png";
import logoutIcon from "../../../assets/icons/logout.png";
import addIcon from "../../../assets/icons/Addition-button.png";
import updateIcon from "../../../assets/icons/edit.png";
import deleteIcon from "../../../assets/icons/trash.png";
import Delete from "../../../components/delete-ui/Delete";

/**
 * ListUser Component
 * A React component for displaying a list of users with options to delete users, add new users, and log out.
 *
 * @component
 * @example
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function ListUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setAdminName(parsedUser.name || "");
      setUserRole(parsedUser.role || "");
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

  /**
   * Handles the delete user actions.
   *
   * @param {string} action - The type of delete action to perform ('show', 'confirm', 'cancel').
   * @param {string} [id] - The ID of the user to delete (required if action is 'show' or 'confirm').
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
        console.error("Invalid action for delete");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout"); 
      if (response) {
        toast.success("Logged out successfully!");
        localStorage.clear();
        setTimeout(() => navigate("/"), 300);
      } else {
        localStorage.clear();
        setTimeout(() => navigate("/"), 300);
        toast.error("Failed to log out!");
        throw new Error("Failed to log out");
      }
    } catch (err) {
      console.error("Error during logout: ", err);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="row mx-0" style={{ height: "100vh", overflowX: "hidden" }}>
      <div className="col-md-3 col-lg-2 text-white p-0 position-fixed h-100">
        <SideBar title={adminName} />
      </div>

      <div className="col-md-9 col-lg-10 offset-lg-2">
        <button
          className="btn btn-link d-flex align-items-center text-dark text-decoration-none"
          style={{ marginLeft: "87%", marginTop: "30px" }}
          onClick={handleLogout}
        >
          <label style={{ fontSize: "20px", cursor: "pointer" }}>Logout</label>
          <img
            src={logoutIcon}
            alt="logout"
            className="ms-2"
            style={{ width: "20px", height: "20px" }}
          />
        </button>

        <ToastContainer />

        <div
          className="main-listUser container py-4 border mt-2"
          style={{
            width: "95%",
            height: "80vh",
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom">
            <h3 className="d-flex align-items-center">
              <img
                src={User}
                alt="User"
                className="me-2"
                style={{ height: "25px" }}
              />
              Users
            </h3>
            <Link
              to="/usersList/add"
              className="btn btn-primary d-flex align-items-center mb-2"
            >
              <img
                src={addIcon}
                alt="Add"
                className="me-2"
                style={{ width: "20px", height: "20px" }}
              />
              Add
            </Link>
          </div>

          <ul
            className="list-unstyled m-0"
            style={{
              maxHeight: "60vh", 
              overflowY: "auto", 
              overflowX: "hidden", 
              paddingRight: "10px", 
            }}          >
            {users.map((user) => (
              <li
                key={user.id}
                className="d-flex align-items-center justify-content-between py-2"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={user.name}
                >
                  <span>{user.name}</span>
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <span>{user.role}</span>
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                  }}
                >
                  <Link
                    to={`/usersList/update/${user.id}`}
                    state={{ name: user.name, role: user.role }} 
                  >
                    <img
                      src={updateIcon}
                      alt="update"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "10px",
                      }}
                    />
                  </Link>
                  <img
                    src={deleteIcon}
                    alt="delete"
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteAction("show", user.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
    </div>
  );
}
