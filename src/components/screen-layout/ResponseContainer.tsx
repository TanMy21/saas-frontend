import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const ResponseContainer = ({ children, className = "" }: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flex:1,
        marginX: "auto",
        flexDirection: "row",
        marginTop:"1%",
        marginBottom: "4%",
        width: "98%",
        zIndex: 10,
        border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default ResponseContainer;
