import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";
import { ElementSettingsProps } from "../../../utils/types";

import MediaOptionSettings from "./ElementSettingsComponents/MediaOptionSettings";
import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const MediaElementSettings = ({ qID }: ElementSettingsProps) => {
  const { canEditQuestion } = usePermission();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        heigh: "100%",
      }}
    >
      {canEditQuestion && <QuestionTypeMutationSettings />}
      <QuestionContentSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
      <MediaOptionSettings />
    </Box>
  );
};

export default MediaElementSettings;
