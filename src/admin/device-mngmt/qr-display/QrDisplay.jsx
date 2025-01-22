/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars, react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "../../../index";
import {
  Modal,
  Box,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";

/**
 * Qrcode Component
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.visible - Determines whether the QR code modal is visible.
 * @param {string} props.id - The ID of the location for which the QR code is to be fetched.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element|null} A modal displaying the QR code, or null if not visible.
 */
export default function Qrcode({ visible, id, onClose }) {
  const imageSrc = axios.defaults.baseURL+'/locations/'+id+'/qrcode'
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
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          zIndex: 1300,
        }}
      >
        <Box>
          <Typography variant="h6" mb={2}>
            QR Code
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              component='img'
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxHeight: "80vh",
                overflow: "hidden",
              }}
              src={imageSrc}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
