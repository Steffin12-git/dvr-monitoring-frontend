/* eslint-disable no-unused-vars, react/prop-types */
import React from "react";
import "../index.css"
import { Link, useLocation } from "react-router-dom";
import adminIcon from "../assets/icons/Admin.png";
import mainlogo from "../assets/icons/Main_logo.png";

/**
 * A sidebar component that provides navigation links for admin users.
 * 
 * @component
 * 
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display in the sidebar.
 * 
 * @returns {JSX.Element} The rendered sidebar component.
 */
export default function SideBar({ title }) {
  const location = useLocation();

  /**
   * Determines if the given path is the current active route.
   *
   * @function isActive
   * @param {string} path - The path to check.
   * @returns {boolean} True if the current path matches the given path, otherwise false.
   */
  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-sidebar d-flex flex-column bg-white shadow vh-100">
      <div className="d-flex flex-column align-items-center py-3">
        <div className="mb-3">
          <img
            src={mainlogo}
            alt="logo"
            className="rounded-circle border border-secondary"
            style={{ width: "90px", height: "90px" }}
          />
        </div>
        <div className="w-100" />

        <div className="text-center">
          <img
            src={adminIcon}
            alt="admin-icon"
            className="mb-2"
            style={{ width: "25px", height: "25px" }}
          />
          <h2 className="h5 fw-bolder text-dark">{title}</h2>
        </div>
        <hr className="w-100" />

        <div className="w-100">
          <div
            className={`text-center py-2 ${isActive("/usersList") ? "bg-primary text-white" : ""}`}
          >
            <Link
              to="/usersList"
              className={`text-decoration-none ${isActive("/usersList") ? "text-white" : "text-dark"}`}
            >
              <h3 className="h6 m-0" style={{ height: "5vh" }}>
                Users
              </h3>
            </Link>
          </div>

          <div
            className={`text-center py-2 ${isActive("/devicesList") ? "bg-primary text-white" : ""}`}
          >
            <Link
              to="/devicesList"
              className={`text-decoration-none ${isActive("/devicesList") ? "text-white" : "text-dark"}`}
            >
              <h3 className="h6 m-0" style={{ height: "5vh" }}>
                Devices
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

