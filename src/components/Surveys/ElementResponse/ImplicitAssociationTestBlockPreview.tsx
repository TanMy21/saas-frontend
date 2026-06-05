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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#BE185D" }}>
          IAT preview
        </Typography>

        <Chip
          label="Compatible block"
          size="small"
          sx={{
            bgcolor: "#FCE7F3",
            color: "#BE185D",
            fontWeight: 700,
          }}
        />
      </Box>

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
          <Typography sx={{ fontSize: 12, color: "#64748B", mb: 0.75 }}>
            Center stimulus
          </Typography>

          <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>
            {centerStimulus}
          </Typography>
        </Box>

        <ImplicitAssociationSideCard keyLabel="I" title={rightCategory} />
      </Box>

      <Typography sx={{ mt: 1.5, fontSize: 12, color: "#BE185D" }}>
        Participants sort mixed brand/product items and attribute words using E
        and I.
      </Typography>
    </Box>
  );
};
