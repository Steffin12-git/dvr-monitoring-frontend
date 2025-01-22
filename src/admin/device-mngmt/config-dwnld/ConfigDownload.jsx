/* eslint-disable no-unused-vars, react/prop-types */
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../../index";
import downloadIcon from "../../../assets/icons/config-download.png";

/**
 * DownloadFile Component
 *
 * @param {Object} props - Component props.
 * @param {string} props.deviceID - The ID of the device for which the configuration file should be downloaded.
 */
export default function DownloadFile({ deviceID }) {
  const configuration =
    axios.defaults.baseURL + `/locations/${deviceID}/configuration`;
  return (
    <>
      <a
        href={configuration}
        style={{ width: "20px", height: "20px", padding: 0 }}
      >
        <img
          src={downloadIcon}
          alt="Download Configuration"
          className="img-small"
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            padding: "2",
            verticalAlign: "top",
          }}
        />
      </a>
      <ToastContainer />
    </>
  );
}
