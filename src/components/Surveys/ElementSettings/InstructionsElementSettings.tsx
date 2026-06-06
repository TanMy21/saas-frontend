import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

const InstructionsElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    ></Box>
  );
};

export default InstructionsElementSettings;
