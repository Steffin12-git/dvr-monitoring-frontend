/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../index";
import "react-toastify/dist/ReactToastify.css";
import update from "../../../assets/icons/edit.png";
import username from "../../../assets/icons/monitoring-main-icon.png";

/**
 * AddDevice Component
 *
 * This React component provides a form for adding a new device having input fields for the device name, URL profile, and a checkbox for a special flag.
 *
 * @component
 */
export default function AddDevice() {
  const navigate = useNavigate();
  const [device, setDevice] = useState({
    name: "",
    urlProfile: "",
    special: false,
  });
  const [urlProfiles, setUrlProfiles] = useState([]);

  /**
   * Fetches the available URL profiles from the server.
   *
   * This function makes a GET request to the server's API endpoint to retrieve a list of available URL profiles and updates the state accordingly.
   *
   * @async
   * @function fetchUrlProfiles
   */
  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        const response = await axios.get("/devices/urlProfiles");
        if (response.status === 200) {
          const data = response.data;
          if (Array.isArray(data)) {
            setUrlProfiles(data.map((profile) => profile.name));
          } else {
            throw new Error("Invalid data format: Expected an array");
          }
        } else {
          toast.error("Failed to fetch URL profiles. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
        toast.error("An error occurred while fetching URL profiles.");
      }
    }

    fetchUrlProfiles();
  }, []);

  /**
   * Handles the form submission for adding a new device.
   *
   * This function validates that the device name and URL profile are provided, and sends a POST request to the server.
   * Upon successful submission, new device is added successfully and displays a success message or displays error message on failure.
   *
   * @async
   * @function handleSubmit
   * @param {Event} e - The form submission event.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!device.name || !device.urlProfile) {
      toast.warn("Device name and URL profile are required.", {
        autoClose: 500,
      });
      return;
    }

    try {
      const response = await axios.post(`/devices`, {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });

      if (response.status === 200) {
        toast.success("Device added successfully!");
        setTimeout(() => navigate("/devicesList"), 300);
      } else {
        toast.error("Failed to add device. Please try again.");
      }
    } catch (err) {
      console.error("Error adding device:", err);
      toast.error(
        "An error occurred while adding the device. Please try again.",
        {
          autoClose: 500,
        }
      );
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <ToastContainer />
      <form
        className="bg-white p-4 p-md-5 rounded shadow-sm mb-4"
        style={{ width: "30%", maxWidth: "600px" }}
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-5">
          <img src={update} alt="icon" className="mb-3" />
          <h3 className="fw-bold text-dark">Add New Device</h3>
          <div className="bg-primary mt-2" style={{ height: "2px" }}></div>
        </div>

        <div className="mb-3">
          <label className="form-label">Device Name</label>
          <div className="position-relative mb-3">
            <img
              src={username}
              alt="username"
              className="position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ width: "20px", height: "20px" }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Enter device name"
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">URL Profile</label>
          <select
            className="form-select"
            name="urlProfile"
            value={device.urlProfile}
            onChange={(e) =>
              setDevice({ ...device, urlProfile: e.target.value })
            }
            required
          >
            <option value="">Select</option>
            {Array.isArray(urlProfiles) &&
              urlProfiles.map((profileName, index) => (
                <option key={index} value={profileName}>
                  {profileName}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-5 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="specialCheck"
            checked={device.special}
            onChange={() => setDevice({ ...device, special: !device.special })}
          />
          <label className="form-check-label" htmlFor="specialCheck">
            Special
          </label>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary ">
            Add
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/devicesList")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
