/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars, react/prop-types */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../../index";
import {
  Modal,
  Box,
  Backdrop,
  Typography,
  CircularProgress,
} from "@mui/material";

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
   * Represents the URL of the fetched QR code.
   */
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches the QR code image from the server using the provided `id`.
   * If successful, sets the QR code URL in the component state.
   * Displays an error toast in case of a failure.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function fetchQRCode() {
    setLoading(true);
    try {
      const response = await axios.get(`/devices/${id}/qrcode`);
      if (response.status !== 200 || !response.data) {
        toast.error("Failed to fetch QR code");
        throw new Error("Failed to fetch QR code");
      }
      setQrCodeData(response.data);
    } catch (err) {
      toast.error("An error occurred while fetching the QR code.");
      console.error("Error fetching QR code: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (visible && id) {
      fetchQRCode();
    }
  }, [id, visible]);

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          zIndex: 1300
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : qrCodeData ? (
          <>
            <Typography variant="h6" mb={2}>
              QR Code
            </Typography>
            <img
              src={qrCodeData}
              alt="QR Code"
              style={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          </>
        ) : (
          <Typography variant="body1" color="error">
            Failed to load QR code
          </Typography>
        )}
      </Box>
    </Modal>
  );
}
