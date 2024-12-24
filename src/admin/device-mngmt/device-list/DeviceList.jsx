/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../index";
import SideBar from "../../SideBar";
import Devices_main from "../../../assets/icons/monitoring-main-icon.png";
import logout from "../../../assets/icons/logout.png";
import Addition from "../../../assets/icons/Addition-button.png";
import update from "../../../assets/icons/edit.png";
import deleteIcon from "../../../assets/icons/trash.png";
import qr_code from "../../../assets/icons/qr-code.png";
import Delete from "../../../components/delete-ui/Delete";
import Qrcode from "../qr-display/QrDisplay";
import Download_file from "../config-dwnld/ConfigDownload";

/**
 * Devices Component
 *
 * This component displays a list of devices fetched from the server and provides functionalities
 * to add, update, delete devices, generate QR codes, and download config files for each device.
 *
 * @component
 */
export default function Devices() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [adminName, setAdminName] = useState("");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setAdminName(parsedUser.name || " ");
      setUserRole(parsedUser.role || " ");
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

        if (err.response?.status === 401) {
          handleLogout();
        }
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

  /**
   * Handles user logout by clearing the cookie and sending a logout request to the server.
   */
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
          style={{ marginTop: "30px", marginLeft: "87%" }}
          onClick={handleLogout}
        >
          <label
            style={{ fontSize: "20px", color: "black", cursor: "pointer" }}
          >
            Logout
          </label>
          <img
            src={logout}
            alt="logout"
            className="ms-2 "
            style={{ width: "20px", height: "20px" }}
          />
        </button>
        <ToastContainer />
        <div
          className="container py-4 border mt-2"
          style={{ width: "95%", height: "80vh" }}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom">
            <h3 className="d-flex align-items-center">
              <img
                src={Devices_main}
                alt="Devices"
                className="me-2"
                style={{ height: "25px" }}
              />
              Devices
            </h3>
            <div className="button-listuser" style={{ marginBottom: "10px" }}>
              <Link
                to="/devicesList/add"
                className="text-white text-decoration-none"
              >
                <button
                  className="btn btn-primary"
                  style={{ padding: "5px 10px", alignItems: "center" }}
                >
                  <img
                    src={Addition}
                    alt="Add"
                    className="me-2"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Add
                </button>
              </Link>
            </div>
          </div>
          <div className="">
            <ul
              className="list-unstyled m-0"
              style={{
                maxHeight: "60vh", 
                overflowY: "auto", 
                overflowX: "hidden", 
                paddingRight: "10px", 
              }}
            >
              {devices.map((device) => (
                <li
                  key={device.id}
                  className="d-flex align-items-center justify-content-between py-2"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  <div
                    style={{
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={device.name}
                  >
                    <span>{device.name}</span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <span>{device.latestHandshakeAt || "N/A"}</span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <Link
                      to={`/devicesList/update/${device.id}`}
                      state={{
                        name: device.name,
                        urlProfile: device.urlProfile,
                        special: device.special,
                      }}
                    >
                      <img
                        src={update}
                        alt="update"
                        style={{ width: "20px", height: "20px",marginBottom:"3px" }}
                      />
                    </Link>
                    <img
                      src={qr_code}
                      alt="qr-code"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedDeviceId(device.id);
                        setQrCodeVisible(true);
                      }}
                    />
                    <Download_file deviceID={device.id} />
                    <img
                      src={deleteIcon}
                      alt="delete"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteAction("show", device.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Delete
        title={"Delete the device"}
        description={"Are you sure you want to delete the device?"}
        visible={deletePopupVisible}
        onAction={handleDeleteAction}
        onCancel={() => handleDeleteAction("cancel")}
        onConfirm={() => handleDeleteAction("confirm")}
      />
      <Qrcode
        visible={qrCodeVisible}
        id={selectedDeviceId}
        onClose={() => setQrCodeVisible(false)}
      />
    </div>
  );
}
