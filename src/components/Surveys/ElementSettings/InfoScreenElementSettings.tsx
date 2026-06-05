import { Box } from "@mui/material";

import { QuestionTextSettings } from "./ElementSettingsComponents/QuestionTextSettings";

const InfoScreenElementSettings = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <QuestionTextSettings />
    </Box>
  );
};

export default InfoScreenElementSettings;
