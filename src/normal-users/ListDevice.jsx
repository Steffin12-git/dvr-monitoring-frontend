/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../index";
import logoutIcon from "../assets/icons/logout.png";
import mainLogo from "../assets/icons/Main_logo.png";
import monitorIcon from "../assets/icons/monitoring-main-icon.png";

/**
 * A React component that displays a list of devices grouped by URL profiles.
 *
 * @component
 * @example
 * <DeviceListUser />
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function DeviceListUser() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [urlProfiles, setUrlProfiles] = useState([]);

  /**
   * Fetches the list of devices and URL profiles from the axios.
   *
   * @async
   * @function fetchData
   * @throws {Error} If the fetch requests fail.
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const devicesResponse = await axios.get("/devices");

        if (!devicesResponse) {
          throw new Error("Failed to fetch devices.");
        }
        const devicesData = await devicesResponse.data;
        setDevices(devicesData);

        const profilesResponse = await axios.get("/devices/urlProfiles");

        if (!profilesResponse) {
          throw new Error("Failed to fetch URL profiles.");
        }

        const profilesData = await profilesResponse.data;

        const profileMapping = profilesData.map((profile) => {
          const relatedDevices = devicesData.filter(
            (device) => device.urlProfile === profile.name
          );

          const groupedByTime = relatedDevices.reduce((acc, device) => {
            const time = device.latestHandshakeAt || "No Handshake Time";
            if (!acc[time]) acc[time] = [];
            acc[time].push(device.name);
            return acc;
          }, {});

          return {
            profileName: profile.name,
            groupedDevices: Object.entries(groupedByTime).map(
              ([time, devices]) => ({
                time,
                devices,
              })
            ),
          };
        });

        setUrlProfiles(profileMapping);
      } catch (err) {
        toast.error("Error fetching data. Please try again.");
        console.error("Fetch error:", err);
      }
    }

    fetchData();
  }, []);

  /**
   * Handles the user logout operation.
   *
   * @function handleLogout
   * @async
   * @throws {Error} If the logout operation fails.
   */
  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");

      if (!response.ok) {
        toast.error("Failed to log out");
        setTimeout(() => navigate("/"), 350);
        throw new Error("Failed to log out");
      }
      toast.success("Logged out successfully!");
      localStorage.clear();
      setTimeout(() => navigate("/"), 350);
    } catch (err) {
      console.error("Error during logout: ", err);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="row mx-0 vh-100 overflow-hidden">
      <div className="container-fluid d-flex flex-column h-100">
        <ToastContainer />
        <header className="header d-flex justify-content-between align-items-center px-5 py-2 border-bottom mt-3">
          <img
            src={mainLogo}
            alt="Main Logo"
            className="img-fluid"
            style={{ maxWidth: "70px" }}
          />
          <button
            className="btn btn-link d-flex align-items-center text-dark text-decoration-none"
            onClick={handleLogout}
          >
            <span className="d-none d-md-block fs-5">Logout</span>
            <img
              src={logoutIcon}
              alt="Logout"
              className="ms-2"
              style={{ width: "20px", height: "20px" }}
            />
          </button>
        </header>

        <main className="flex-grow-1 container py-4 mt-2">
          <div>
            <h3 className="text-center text-md-start">
              <img
                src={monitorIcon}
                alt="Monitor"
                className="me-2"
                style={{ height: "25px" }}
              />
              Devices
            </h3>
            <hr className="border-bottom mb-4" />
            <div
              className="table-responsive"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <table className="table border-none">
                <tbody>
                  {urlProfiles.map((profile) =>
                    (profile.groupedDevices || []).map((group, index) => (
                      <tr key={`${profile.profileName}-${index}`}>
                        <td>{profile.profileName}</td>
                        <td>{group.time}</td>
                        <td>{group.devices.join(", ")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
