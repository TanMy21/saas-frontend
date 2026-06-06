import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const DropdownElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <QuestionContentSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
    </Box>
  );
};

export default DropdownElementSettings;
