import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import IATBehaviorSettings from "./ElementSettingsComponents/IATBehaviorSettings";
import IATCategorySettings from "./ElementSettingsComponents/IATCategorySettings";
import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const IATElementSettings = ({ qID }: ElementSettingsProps) => {
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
      <IATCategorySettings qID={qID} />
      <IATBehaviorSettings qID={qID} />
    </Box>
  );
};

export default IATElementSettings;
