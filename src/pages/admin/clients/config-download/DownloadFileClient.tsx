import { JSX } from "react";
import { IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "../../../../main";


/**
 * Props for the DownloadFile component.
 */
interface DownloadFileProps {
  deviceID: string;
}


/**
 * DownloadFile Component
 *
 * A button that allows users to download the configuration file for a specific device.
 * When clicked, it opens the configuration file URL in a new tab for download.
 *
 * @component
 * @param {DownloadFileProps} props - Component props
 * @returns {JSX.Element} The rendered download button.
 */
export default function DownloadFileClient({ deviceID }: DownloadFileProps): JSX.Element {
  const configUrl = axios.defaults.baseURL+ `/clients/${deviceID}/configuration`;

  const handleDownload = () => {
    window.open(configUrl, "_blank");
  };

  return (
    <IconButton
      onClick={handleDownload}
      aria-label="Download Configuration"
      sx={{ color: "#2d3748", mr: 1 }}
    >
      <FileDownloadIcon />
    </IconButton>
  );
}
