import { JSX, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "../../../../main";

/**
 * Props for ImportUrlProfile component.
 */
interface ImportUrlProfileProps {
  visible: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

/**
 * ImportUrlProfile Component
 *
 * A modal that allows importing a URL profile as a file.
 * Handles file selection, API upload, and error responses.
 * 
 * @component
 * @param {ImportUrlProfileProps} props - Component props.
 * @returns {JSX.Element} The rendered ImportUrlProfile modal.
 */
export default function ImportUrlProfile({
  visible,
  onClose,
  onImportSuccess,
}: ImportUrlProfileProps): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles file selection and updates state.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null); // Clear error when a new file is selected
    }
  };


  /**
   * Uploads the selected file to the API and handles responses.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/urlProfiles/import", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null); 
      setError(null); 
      onImportSuccess(); 
      handleClose();
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Invalid URL profile format.");
            break;
          case 401:
            setError("Unauthorized! Please login.");
            break;
          case 403:
            setError("Access denied! Admin permission required.");
            break;
          case 409:
            setError("Filename conflict! A URL profile with the same name already exists.");
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


  
  /**
   * Handles modal close and resets errors.
   */
  const handleClose = () => {
    setError(null); // Clear error when modal closes
    setFile(null); // Reset file selection
    onClose();
  };

  return (
    <Modal open={visible} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: 400,
          bgcolor: "#d8d8e1",
          boxShadow: 24,
          borderRadius: 2,
          p: 0,
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/*Title*/}
        <Box
          sx={{
            bgcolor: "#45527a",
            color: "white",
            textAlign: "center",
            py: 1.5,
          }}
        >
          <Typography variant="h6">Import URL Profile</Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 3 }}>
          <input type="file" accept=".json" onChange={handleFileChange} />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              sx={{
                  bgcolor: "#2d3b63",
                  "&:hover": { bgcolor: "#1f2a4a" }, 
                }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
                <Button variant="outlined" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
