/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "../../../index";
import { useNavigate, useParams } from "react-router-dom";
import update from "../../../assets/icons/edit.png";
import username from "../../../assets/icons/monitoring-main-icon.png";
import { toast, ToastContainer } from "react-toastify";

/**
 * UpdateDevice Component
 *
 * This component provides a form interface to update the details of a specific device.
 * It fetches URL profiles for selection and updates the device details on form submission.
 *
 * @component
 * @returns {JSX.Element} The UpdateDevice component
 */

export default function UpdateDevice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [device, setDevice] = useState({
    name: "",
    urlProfile: "",
    special: false,
  });
  const [urlProfiles, setUrlProfiles] = useState([]);
  const [error, setError] = useState("");

  /**
   * Fetches the available URL profiles from the server.
   * Updates the `urlProfiles` state with the retrieved data.
   * Displays an error message if the fetch fails.
   */
  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        const response = await axios.get("/urlProfiles");
        if (!response) {
          toast.success("error fetching url profiles");
        }

        const data = await response.data;
        console.log("Fetched URL Profiles Data:", data);

        if (Array.isArray(data)) {
          setUrlProfiles(data.map((profile) => profile.name));
        } else {
          throw new Error("Data is not an array");
        }
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
        setError("Could not load URL profiles. Please try again later.");
      }
    }

    fetchUrlProfiles();
  }, []);

  /**
   * Handles form submission to update the device details.
   * Sends the updated device information to the server.
   * Redirects to the devices list on success or displays an error message on failure.
   *
   * @param {React.FormEvent} e - The form submit event
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!device.name || !device.urlProfile === "Select") {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.put(`/devices/${id}`, {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });

      if (response) {
        toast.success(" device updated succesfully");
        setTimeout(() => {
          navigate("/devicesList");
        }, 500);
      } else {
        setError("Failed to update device. Please try again later.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again!");
      setError("An error occurred. Please try again!");
      console.error(err);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <form
        className="bg-white p-4 rounded shadow-lg"
        onSubmit={handleSubmit}
        style={{ width: "30vw", height: "80%" }}
      >
        <div className="text-center mb-4">
          <img src={update} alt="icon" className="mb-2" />
          <h2 className="fw-bold text-dark">Edit Device</h2>
          <div className="bg-primary mt-2" style={{ height: "2px" }}></div>
        </div>
        <div className="mb-4">
          <label className="form-label">Device Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <img
                src={username}
                alt="username"
                className="icon"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter device name"
              value={device.name}
              onChange={(e) => setDevice({ ...device, name: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">URL Profile</label>
          <select
            className="form-select"
            value={device.urlProfile}
            onChange={(e) =>
              setDevice({ ...device, urlProfile: e.target.value })
            }
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

        <div className="mb-3 form-check">
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

        <div
          className="d-flex justify-content-center"
          style={{ gap: "70px", marginTop: "15%" }}
        >
          <button type="submit" className="btn btn-primary">
            Update
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
