import { Box } from "@mui/material";

import { ScreenLayoutProps } from "../../utils/types";

const ResponseContainer = ({
  children,
  marginTopOveride,
  className = "",
}: ScreenLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        // flex: 1,
        marginX: "auto",
        flexDirection: "row",
        marginTop: marginTopOveride ?? "2%",
        marginBottom: "4%",
        width: "98%",
        zIndex: 10,
        // border: "2px solid red",
      }}
    >
      {children}
    </Box>
  );
};

export default ResponseContainer;
