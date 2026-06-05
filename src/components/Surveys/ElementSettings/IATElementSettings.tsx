import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import IATBehaviorSettings from "./ElementSettingsComponents/IATBehaviorSettings";
import IATCategorySettings from "./ElementSettingsComponents/IATCategorySettings";
import QuestionTextandDescriptionSettings from "./ElementSettingsComponents/QuestionTextAndDescriptionSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";
import ShowQuestionSettings from "./ElementSettingsComponents/ShowQuestionSettings";

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
      <QuestionTextandDescriptionSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
      <IATCategorySettings qID={qID} />
      <IATBehaviorSettings qID={qID} />
      <ShowQuestionSettings />
    </Box>
  );
};

export default IATElementSettings;
