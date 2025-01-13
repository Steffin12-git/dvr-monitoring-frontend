import { GlobalStyles } from "@mui/material";

const ScrollbarStyles = () => (
  <GlobalStyles
    styles={{
      "::-webkit-scrollbar": {
        width: "0.4em",
      },
      "::-webkit-scrollbar-track": {
        background: "#f1f1f1",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#888",
        borderRadius: "10px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
        borderRadius: "10px",
      },
    }}
  />
);

export default ScrollbarStyles;
