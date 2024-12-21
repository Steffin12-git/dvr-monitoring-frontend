/* eslint-disable no-unused-vars, react/prop-types */
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../../index";
import download from "../../../assets/icons/config-download.png";

/**
 * Download_file Component
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {string} props.deviceID - The ID of the device for which the configuration file should be downloaded.
 */
export default function Download_file({ deviceID }) {
  /**
   * Handles the download process of the configuration file.
   *
   * @async
   * @function handleDownload
   * @throws {Error} If the file could not be fetched from the server.
   */
  const handleDownload = async () => {
    try {
      const response = await axios.get(`/configFile/${deviceID}`);

      if (!response || response.status !== 200) {
        toast.error("Failed to download file from the server");
        throw new Error("Failed to download file from the server");
      }

      const fileBlob = new Blob([response.data.configFileContent], {
        type: "text/plain",
      });
      const fileUrl = URL.createObjectURL(fileBlob);

      const fileName = `device-${deviceID}-config.txt`;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(fileUrl);
    } catch (err) {
      toast.error("Failed to fetch data for download");
      console.error("Error fetching data: ", err);
    }
  };

  return (
    <>
      <img
        src={download}
        alt="download"
        className="img-small"
        style={{ width: "20px", height: "20px", cursor: "pointer" }}
        onClick={handleDownload}
      />
      <ToastContainer />
    </>
  );
}
