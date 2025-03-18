import { JSX, useEffect, useState } from "react";
import axios from "../../../../main";
import {
  Modal,
  Box,
  Backdrop,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Props for the QrcodeLocation component.
*/
interface QrcodeProps {
  visible: boolean;
  id: string;
  onClose: () => void;
}


/**
 * QrcodeLocation Component
 *
 * A modal that displays the QR code for a specific location. It fetches and verifies 
 * the QR code upon being opened and handles loading states and errors such as 
 * unauthorized access, permission issues, and missing QR codes.
 *
 * @component
 * @param {QrcodeProps} props - Component props
 * @returns {JSX.Element} The rendered QR code modal.
 */
export default function QrcodeLocation({ visible, id, onClose }: QrcodeProps): JSX.Element {
  const imageSrc = axios.defaults.baseURL+`/locations/${id}/qrcode`;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (visible && id) {
      checkQRCode();
    }
  }, [visible, id]);



   /**
   * Checks the availability of the QR code by making a request.
   * Sets loading state and handles different error responses.
   *
   * @async
   * @function checkQRCode
   * @returns {Promise<void>}
   */
  const checkQRCode = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axios.get(imageSrc, {
        withCredentials: true,
        headers: { Accept: "image/svg+xml" },
      });
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Unauthorized! Redirecting to login.");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login", { replace: true });
          break;
          case 403:
            setError("Access denied! Admin permission required.");
            break;
          case 404:
            setError("QR Code not found for this location.");
            break;
          default:
            setError("An unexpected error occurred.");
        }
      } else {
        setError("Network error! Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
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
        <Typography variant="h6" mb={2}>
          QR Code
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box
            component="img"
            src={imageSrc}
            alt="QR Code"
            sx={{
              width: "100%",
              maxHeight: "80vh",
              display: "block",
              margin: "auto",
            }}
          />
        )}
      </Box>
    </Modal>
  );
}
