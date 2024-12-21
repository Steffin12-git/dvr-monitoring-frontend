/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../../index";

/**
 * Qrcode Component
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.visible - Determines whether the QR code modal is visible.
 * @param {string} props.id - The ID of the device for which the QR code is to be fetched.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element|null} A modal displaying the QR code, or null if not visible.
 */
export default function Qrcode({ visible, id, onClose }) {
  /**
   * @typedef {string|null} QRCodeData
   * Represents the URL of the fetched QR code.
   */
  const [qrCodeData, setQrCodeData] = useState(null);

  /**
   * Fetches the QR code image from the server using the provided `id`.
   * If successful, sets the QR code URL in the component state.
   * Displays an error toast in case of a failure.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function fetchQRCode() {
    try {
      const response = await axios.get(`/qrCode/${id}`);
      if (response.status !== 200 || !response.data || !response.data.qrCode) {
        toast.error("Failed to fetch QR code");
        throw new Error("Failed to fetch QR code");
      }

      setQrCodeData(response.data.qrCode);
    } catch (err) {
      toast.error("An error occurred while fetching the QR code.");
      console.error("Error fetching QR code: ", err);
    }
  }

  useEffect(() => {
    if (visible && id) {
      fetchQRCode();
    }
  }, [id, visible]);

  if (!visible || !qrCodeData) {
    return null;
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{
          width: "50vw",
          height: "90vh",
        }}
      >
        <img
          src={qrCodeData}
          alt="QR Code"
          style={{
            width: "100%",
            height: "80vh",
            objectFit: "contain",
            margin: "10px",
          }}
        />
      </div>
    </div>
  );
}
