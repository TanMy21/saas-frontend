import { Box } from "@mui/material";

import { ElementSettingsProps } from "../../../utils/types";

import ScreenSettings from "./ElementSettingsComponents/ScreenSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const WelcomeScreenElementSettings = ({
  qID,
  qText,
  qDescription,
  qSettings,
}: ElementSettingsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
        // border: "2px solid red",
      }}
    >
      <ScreenSettings
        qID={qID}
        qText={qText}
        qDescription={qDescription!}
        qSettings={qSettings!}
      />
      <ScreenTypographySettings qID={qID}/>
    </Box>
  );
};

export default WelcomeScreenElementSettings;
