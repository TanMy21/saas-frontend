import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const EmailContactElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <QuestionContentSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default EmailContactElementSettings;
