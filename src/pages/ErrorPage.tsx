import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import { useAppTheme } from "../theme/useAppTheme";

const ErrorPage = () => {
  const { primary } = useAppTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "96vh",
        // border: "2px solid red",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          height: "80%",
          margin: "0 auto",
          // border: "2px solid blue",
        }}
      >
        <img src="/error_500.svg" style={{ width: "100%", height: "100%" }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          height: "10%",
          margin: "0% auto",
          // border: "2px solid blue",
        }}
      >
        <h2 style={{ color: "#455A64" }}>Oops! Something went wrong</h2>
        <Link
          to="/dash"
          style={{
            textDecoration: "none",
            color: primary.main,
            fontWeight: "bold",
          }}
        >
          Go Home
        </Link>
      </Box>
    </Box>
  );
};

export default ErrorPage;
