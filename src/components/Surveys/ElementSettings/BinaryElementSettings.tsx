import { Box } from "@mui/material";

import { usePermission } from "../../../context/PermissionContext";
import { ElementSettingsProps } from "../../../utils/types";

import BinaryOptionsSettings from "./ElementSettingsComponents/BinaryOptionsSettings";
import QuestionContentSettings from "./ElementSettingsComponents/QuestionSettings";
import { QuestionTypeMutationSettings } from "./ElementSettingsComponents/QuestionTypeMutationSettings";
import ScreenTypographySettings from "./ElementSettingsComponents/ScreenTypographySettings";

const BinaryElementSettings = ({ qID }: ElementSettingsProps) => {
  const { canEditQuestion } = usePermission();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        // border:"2px solid blue",
      }}
    >
      {canEditQuestion && <QuestionTypeMutationSettings />}
      <QuestionContentSettings />
      <ScreenTypographySettings key={qID} qID={qID} />
      <BinaryOptionsSettings />
    </Box>
  );
};

export default BinaryElementSettings;
