import React, { JSX, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "../../../../main";


/**
 * Props for the AddUrlProfileModal component.
 */
interface AddUrlProfileModalProps {
  open: boolean;
  onClose: () => void;
  onProfileAdded: () => void;
}


/**
 * Interface for representing a single URL entry within the URL profile.
 */
interface UrlEntry {
  name: string;
  template: string;
}


/**
 * The AddUrlProfileModal component allows users to create a new URL profile.
 * Users can enter a profile name and add multiple URLs with corresponding names and templates.
 * 
 * @component
 * @param {AddUrlProfileModalProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const AddUrlProfileModal: React.FC<AddUrlProfileModalProps> = ({ open, onClose, onProfileAdded }: AddUrlProfileModalProps): JSX.Element => {
  const [profileName, setProfileName] = useState("");
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  /**
 * Adds a new empty row to the URL entries table.
 */
  const handleAddUrlRow = () => {
    setUrls([...urls, { name: "", template: "" }]);
  };


  /**
   * Updates the specified field of a URL entry.
   * 
   * @param {number} index - The index of the URL entry to update.
   * @param {"name" | "template"} field - The field to update (either "name" or "template").
   * @param {string} value - The new value for the field.
   */
  const handleUrlChange = (index: number, field: keyof UrlEntry, value: string) => {
    const updatedUrls = [...urls];
    updatedUrls[index][field] = value;
    setUrls(updatedUrls);
  };


  /**
   * Removes a URL entry from the list.
   * 
   * @param {number} index - The index of the URL entry to remove.
   */
  const handleRemoveUrlRow = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };


   /**
   * Submits the new URL profile to the backend API.
   * Validates input fields before sending the request.
   * 
   * @async
   */
  const handleSubmit = async () => {
    if (!profileName.trim()) {
      setError("Profile name is required.");
      return;
    }
    if (urls.length === 0) {
      setError("At least one URL entry is required.");
      return;
    }
    if (urls.some((url) => !url.name.trim() || !url.template.trim())) {
      setError("Each URL entry must have both Name and Template.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "/urlProfiles",
        { name: profileName, urls },
        { withCredentials: true }
      );
      onProfileAdded();
      onClose();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError("Invalid URL Profile Data.");
        } else if (err.response?.status === 401) {
          setError("Unauthorized! Please login.");
        } else if (err.response?.status === 403) {
          setError("You do not have permission to add a URL profile.");
        } else if (err.response?.status === 409) {
          setError("A URL profile with this name already exists.");
        } else {
          setError("Failed to add URL profile.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Centered Title */}
      <DialogTitle
        sx={{
          bgcolor: "#45527a",
          color: "white",
          textAlign: "center",
        }}
      >
        Add URL Profile
      </DialogTitle>
      
      {/* Modal Content */}
      <DialogContent sx={{ backgroundColor: "#d8d8e1" }}>
        <TextField
          fullWidth
          label="Profile Name"
          variant="outlined"
          margin="normal"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          sx={{marginTop:5}}
        />
        
       {/* Add URL Entry */}
       <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography variant="subtitle1">URLs</Typography>
        <IconButton onClick={handleAddUrlRow} sx={{ color: "#1976d2", p: 0, ml: 1, mb:0.5 }}>
            <AddIcon />
        </IconButton>
        </Box>


        {/* URL Table */}
        {urls.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#45527a" }}>
                  <TableCell sx={{ color: "white", fontWeight: "600" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "600" }}>Template</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "600", textAlign: "center" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={url.name}
                        onChange={(e) => handleUrlChange(index, "name", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={url.template}
                        onChange={(e) => handleUrlChange(index, "template", e.target.value)}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        onClick={() => handleRemoveUrlRow(index)}
                        sx={{ color: "#e53e3e" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions
        sx={{ backgroundColor: "#d8d8e1", display: "flex", justifyContent: "center" , pb:3}}
        >
        <Button
            onClick={handleSubmit}
            sx={{ mr: 2, backgroundColor: "#2d3b63",
              "&:hover": { backgroundColor: "#1a243d" },}}
            variant="contained"
            disabled={loading}
        >
            Add
        </Button>
        <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
        </Button>
        </DialogActions>

    </Dialog>
  );
};

export default AddUrlProfileModal;
