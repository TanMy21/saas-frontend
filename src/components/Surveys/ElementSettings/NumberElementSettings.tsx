import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";
import { ElementSettingsProps } from "../../../utils/types";

import NumberInputRangeSettings from "./ElementSettingsComponents/NumberInputRangeSettings";
import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const NumberElementSettings = ({ qID }: ElementSettingsProps) => {
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
      <NumberInputRangeSettings />
    </Box>
  );
};

export default NumberElementSettings;
