import { Box, Chip, Typography } from "@mui/material";

import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import { ImplicitAssociationTestBlockPreviewProps } from "../../../types/surveyBuilderTypes";
import { DEFAULT_IAT_PREVIEW } from "../../../utils/constants";

import { ImplicitAssociationSideCard } from "./ImplicitAssociationSideCard";

export const ImplicitAssociationTestBlockPreview = ({
  centerStimulus,
}: ImplicitAssociationTestBlockPreviewProps) => {
  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const uiConfig = question?.questionPreferences?.uiConfig || {};

  const leftCategory =
    uiConfig.iatLeftCategoryLabel || DEFAULT_IAT_PREVIEW.targetA;

  const rightCategory =
    uiConfig.iatRightCategoryLabel || DEFAULT_IAT_PREVIEW.targetB;

  return (
    <Box
      sx={{
        border: "1px solid #FBCFE8",
        bgcolor: "#FDF2F8",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
          alignItems: "center",
          gap: 2,
        }}
      >
        <ImplicitAssociationSideCard keyLabel="E" title={leftCategory} />

        <Box
          sx={{
            minWidth: { xs: "100%", sm: 150 },
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            px: 2,
            py: 2.5,
            textAlign: "center",
            boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>
            {centerStimulus}
          </Typography>
        </Box>

        <ImplicitAssociationSideCard keyLabel="I" title={rightCategory} />
      </Box>
    </Box>
  );
};
