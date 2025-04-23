import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import NumberInputRangeSettings from "./ElementSettingsComponents/NumberInputRangeSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const NumberElementSettings = ({ qID }: ElementSettingsProps) => {
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
      <NumberInputRangeSettings />
      <ValidationSettings />
    </Box>
  );
};

export default NumberElementSettings;
