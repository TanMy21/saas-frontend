import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import BinaryOptionsSettings from "./ElementSettingsComponents/BinaryOptionsSettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ValidationSettings from "./ElementSettingsComponents/ValidationSettings";

const BinaryElementSettings = ({ qID }: ElementSettingsProps) => {
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
      <BinaryOptionsSettings />
    </Box>
  );
};

export default BinaryElementSettings;
