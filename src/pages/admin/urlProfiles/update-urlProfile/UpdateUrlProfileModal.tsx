import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "../../../../main";


/**
* Represents a URL entry with a name and template.
*/
interface UrlEntry {
    name: string;
    template: string;
  }


/**
* Represents a URL profile containing a name and multiple URL entries.
*/
interface UrlProfile {
    name: string;
    urls: UrlEntry[];
  }
  

/**
 * Props for the `UpdateUrlProfileModal` component.
 */
interface UpdateUrlProfileModalProps {
    open: boolean;
    profileData: UrlProfile | null;
    onClose: () => void;
    onProfileUpdated: () => void;
}
  

/**
 * A modal component for updating an existing URL profile.
 *
 * This component allows users to edit the profile name and its associated URL entries.
 * Users can add or remove URL entries dynamically and submit updates to the backend.
 *
 * @component
 * @param {UpdateUrlProfileModalProps} props - The component props.
 * @returns {JSX.Element} The rendered modal component.
 */
const UpdateUrlProfileModal: React.FC<UpdateUrlProfileModalProps> = ({
    open,
    profileData,
    onClose,
    onProfileUpdated,
}) => {
  const [profileName, setProfileName] = useState("");
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  /**
   * Fetches the URL profile data when the modal opens.
   */  
  useEffect(() => {
    if (open) {
      fetchUrlProfile();
    }
  }, [open]);


  /**
   * Updates the state with the profile data when it is available.
   */
  useEffect(() => {
    if (open && profileData) {
      setProfileName(profileData.name);
      setUrls(profileData.urls || []);
    }
  }, [open, profileData]);
  

  /**
   * Fetches the URL profile details from the API.
   * Updates the state with the retrieved profile data.
   * 
   * @async
   * @function fetchUrlProfile
   */
  const fetchUrlProfile = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.get(`/urlProfiles/${profileName}`, {
            withCredentials: true,          
      });
      setProfileName(response.data.name);
      setUrls(response.data.urls || []);
    } catch (err: any) {
      setError("Failed to fetch URL profile data.");
    } finally {
      setLoading(false);
    }
  };


  /**
   * Adds a new empty URL entry row.
   */
  const handleAddUrlRow = () => {
    setUrls([...urls, { name: "", template: "" }]);
  };



  /**
   * Handles changes in a URL entry field.
   * 
   * @param {number} index - The index of the URL entry.
   * @param {keyof UrlEntry} field - The field being updated ("name" or "template").
   * @param {string} value - The new value for the field.
   */
  const handleUrlChange = (index: number, field: keyof UrlEntry, value: string) => {
    const updatedUrls = [...urls];
    updatedUrls[index][field] = value;
    setUrls(updatedUrls);
  };


   /**
   * Removes a URL entry row at the specified index.
   * @param {number} index - The index of the URL entry to remove.
   */
  const handleRemoveUrlRow = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };


  /**
   * Validates and submits the updated URL profile to the backend.
   * Displays appropriate error messages if validation fails.
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
        await axios.put(
            `/urlProfiles/${profileName}`,
            { name: profileName, urls },
            { withCredentials: true }
          );
          
      onProfileUpdated();
      onClose();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError("Invalid URL Profile Data.");
        } else if (err.response?.status === 401) {
          setError("Unauthorized! Please login.");
        } else if (err.response?.status === 403) {
          setError("You do not have permission to update this URL profile.");
        } else if (err.response?.status === 409) {
          setError("A URL profile with this name already exists.");
        } else {
          setError("Failed to update URL profile.");
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
        Update URL Profile
      </DialogTitle>
      
      {/* Modal Content */}
      <DialogContent sx={{ backgroundColor: "#d8d8e1" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              label="Profile Name"
              variant="outlined"
              margin="normal"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              sx={{ mt: 3 }}
            />

            {/* Add URL Entry */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <IconButton onClick={handleAddUrlRow} sx={{ color: "#1976d2", p: 0, mr: 1 }}>
                <AddIcon />
              </IconButton>
              <Typography variant="subtitle1">URLs</Typography>
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
          </>
        )}
      </DialogContent>

      {/* Modal Actions - Center Align Buttons */}
      <DialogActions sx={{ backgroundColor: "#d8d8e1", display: "flex", justifyContent: "center" , pb:3}}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ mr: 2, backgroundColor: "#2d3b63",
            "&:hover": { backgroundColor: "#1a243d" },}}
        >
        Update
        </Button>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUrlProfileModal;
