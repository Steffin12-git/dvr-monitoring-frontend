/* eslint-disable no-unused-vars, react/prop-types */
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

/**
 * Delete Component
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - The title of the delete confirmation dialog.
 * @param {string} props.description - The description or message in the dialog.
 * @param {boolean} props.visible - Determines if the modal is visible.
 * @param {Function} props.onConfirm - Callback function executed on confirmation.
 * @param {Function} props.onCancel - Callback function executed on cancellation.
 * @returns {JSX.Element|null} A responsive modal for delete confirmation.
 */
export default function Delete({ title, description, visible, onConfirm, onCancel }) {
  return (
    <Modal
      open={visible}
      onClose={onCancel}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
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
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography id="delete-modal-title" variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        <Typography id="delete-modal-description" variant="body1" mb={3}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Yes
          </Button>
          <Button variant="outlined" color="primary" onClick={onCancel}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
