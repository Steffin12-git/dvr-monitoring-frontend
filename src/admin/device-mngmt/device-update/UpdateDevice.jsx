/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "../../../index";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import update from "../../../assets/icons/edit.png";
import username from "../../../assets/icons/monitoring-main-icon.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * UpdateDevice Component
 *
 * Allows updating details of a specific device.
 * Fetches URL profiles and preloads device data from the DeviceList component.
 */
export default function UpdateDevice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [device, setDevice] = useState({
    name: location.state?.name || "",
    urlProfile: location.state?.urlProfile || "",
    special: location.state?.special || false,
  });
  const [urlProfiles, setUrlProfiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUrlProfiles() {
      try {
        const response = await axios.get("/devices/urlProfiles");
        const data = response?.data;

        if (Array.isArray(data)) {
          setUrlProfiles(data.map((profile) => profile.name));
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching URL profiles:", error);
        toast.error("Failed to fetch URL profiles.");
      }
    }

    fetchUrlProfiles();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!device.name || device.name.length < 4) {
      toast.error("Device name must be at least 4 characters long.");
      return;
    }
    if (!device.urlProfile) {
      toast.error("Please select a URL profile.");
      return;
    }

    try {
      await axios.put(`/devices/${id}`, {
        name: device.name,
        urlProfile: device.urlProfile,
        special: device.special,
      });
      toast.success("Device updated successfully.");
      setTimeout(() => navigate("/devicesList"), 300);
    } catch (err) {
      console.error("Error updating device:", err);
      toast.error("Failed to update device.");
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
            {urlProfiles.map((profile, index) => (
              <option key={index} value={profile}>
                {profile}
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
            onChange={() =>
              setDevice((prev) => ({ ...prev, special: !prev.special }))
            }
          />
          <label className="form-check-label" htmlFor="specialCheck">
            Special
          </label>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary "
            onClick={() => navigate("/devicesList")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
