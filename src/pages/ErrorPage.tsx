import Box from "@mui/material/Box";

import page404 from "../assets/404.svg";
const ErrorPage = () => {
  //   const error = useRouteError();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          p: "8%",
        }}
      >
        <img src={page404} />
      </Box>
    </>
  );
};

export default ErrorPage;
