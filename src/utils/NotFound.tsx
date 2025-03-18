import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";


/**
 * component that displays a 404 Not Found page.
 * 
 * This component is shown when a user navigates to an invalid or non-existent route.
 * It includes a message, a "404" error code, and a button to return to the home page.
 *
 * @component
 * @returns {JSX.Element} - The rendered 404 page.
 */
const NotFound = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "#d8d8e1",
      }}
    >
      <Typography variant="h1" fontWeight={700} color="#45527a">
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" mb={2}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{ bgcolor: "#45527a", "&:hover": { bgcolor: "#2d3b63" } }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
