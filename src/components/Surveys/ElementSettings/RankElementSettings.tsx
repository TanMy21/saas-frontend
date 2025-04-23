import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const RankElementSettings = ({ qID }: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      <QuestionTextandDescriptionSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
      <ValidationSettings />
    </Box>
  );
};

export default RankElementSettings;
